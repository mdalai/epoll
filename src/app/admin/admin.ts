import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { Poll } from '../poll.model';
import { PollService } from '../poll';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    ClipboardModule,
    MatSnackBarModule,
    MatStepperModule,
    MatChipsModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
  polls = signal<Poll[]>([]);
  editingPoll = signal<Poll | null>(null);
  showCreateNewPollForm = signal(false);
  private readonly formBuilder = inject(FormBuilder);
  private readonly pollService = inject(PollService);
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  form = this.formBuilder.group({
    title: ['', Validators.required],
    options: this.formBuilder.array([
      this.formBuilder.control('', Validators.required),
      this.formBuilder.control('', Validators.required)
    ]),
    settings: this.formBuilder.group({
      allowMultipleVotes: [false],
      allowVoteChange: [false]
    })
  });

  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  addOption(): void {
    this.options.push(this.formBuilder.control('', Validators.required));
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  ngOnInit(): void {
    this.pollService.getPolls().subscribe(polls => {
      this.polls.set(polls);
    });
  }

  copyLink(pollId: string): void {
    const url = `${window.location.origin}/poll/${pollId}`;
    this.clipboard.copy(url);
    this.snackBar.open('Poll link copied to clipboard!', 'Close', {
      duration: 3000,
    });
  }

  editPoll(poll: Poll): void {
    this.editingPoll.set(poll);
    this.showCreateNewPollForm.set(true);

    this.form.patchValue({
      title: poll.title,
      settings: poll.settings
    });

    const optionsFormArray = this.formBuilder.array(
      poll.options.map(option => this.formBuilder.control(option, Validators.required))
    );
    this.form.setControl('options', optionsFormArray);
  }

  updatePollStatus(poll: Poll, status: 'active' | 'paused'): void {
    this.pollService.updatePollStatus(poll.id, status).subscribe(() => {
      this.polls.update(polls =>
        polls.map(p => (p.id === poll.id ? { ...p, status } : p))
      );
    });
  }

  deletePoll(pollId: string): void {
    this.pollService.deletePoll(pollId).subscribe(() => {
      this.polls.update(polls => polls.filter(p => p.id !== pollId));
    });
  }

  cancelEdit(): void {
    this.editingPoll.set(null);
    this.showCreateNewPollForm.set(false);
    this.form.reset({
      title: '',
      settings: {
        allowMultipleVotes: false,
        allowVoteChange: false
      }
    });
    this.options.clear();
    this.addOption();
    this.addOption();
  }

  savePoll(): void {
    if (this.form.invalid) {
      return;
    }

    const editingPoll = this.editingPoll();
    const formValue = this.form.getRawValue();

    if (editingPoll) {
      const updatedPoll: Poll = {
        id: editingPoll.id,
        title: formValue.title ?? '',
        options: formValue.options?.filter((option): option is string => !!option) ?? [],
        status: editingPoll.status,
        settings: {
          allowMultipleVotes: formValue.settings?.allowMultipleVotes ?? false,
          allowVoteChange: formValue.settings?.allowVoteChange ?? false,
        },
      };

      this.pollService.updatePoll(updatedPoll).subscribe(() => {
        this.polls.update(polls =>
          polls.map(p => (p.id === updatedPoll.id ? updatedPoll : p))
        );
        this.cancelEdit();
      });
    } else {
      const newPollData: Omit<Poll, 'id'> = {
        title: formValue.title ?? '',
        options: formValue.options?.filter((option): option is string => !!option) ?? [],
        status: 'active',
        settings: {
          allowMultipleVotes: formValue.settings?.allowMultipleVotes ?? false,
          allowVoteChange: formValue.settings?.allowVoteChange ?? false,
        },
      };
      this.pollService.createPoll(newPollData).subscribe(pollId => {
        const newPoll: Poll = {
          id: pollId,
          ...newPollData,
        };
        this.polls.update(polls => [...polls, newPoll]);
        this.cancelEdit();
      });
    }
  }
}
