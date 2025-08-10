import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, EMPTY } from 'rxjs';
import { Poll } from '../poll.model';
import { PollService } from '../poll';

@Component({
  selector: 'app-poll-vote',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './poll-vote.html',
  styleUrl: './poll-vote.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollVoteComponent {
  id = input.required<string>();

  poll = signal<Poll | null>(null);
  voted = signal(false);
  private readonly formBuilder = inject(FormBuilder);
  private readonly pollService = inject(PollService);
  private readonly snackBar = inject(MatSnackBar);

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    selectedOptions: new FormControl<string[] | string>('', Validators.required)
  });

  constructor() {
    effect(() => {
      const pollId = this.id();
      this.pollService.getPoll(pollId).pipe(
        catchError(err => {
          console.error('Error fetching poll:', err);
          return EMPTY;
        })
      ).subscribe(poll => {
        this.poll.set(poll);
        if (poll.settings.allowMultipleVotes) {
          this.form.setControl('selectedOptions', this.formBuilder.array([], Validators.required));
        } else {
          this.form.setControl('selectedOptions', new FormControl<string | string[]>('', Validators.required));
        }

        // Check if user has already voted
        const name = localStorage.getItem(`poll_${pollId}_voter`);
        if (name) {
          this.form.get('name')?.setValue(name);
          this.form.get('name')?.disable();
        }
      });
    });
  }

  onCheckboxChange(event: any) {
    const selectedOptions = this.form.get('selectedOptions') as FormArray;
    if (event.checked) {
      selectedOptions.push(this.formBuilder.control(event.source.value));
    } else {
      const index = selectedOptions.controls.findIndex(x => x.value === event.source.value);
      selectedOptions.removeAt(index);
    }
  }

  vote(): void {
    if (this.form.invalid) {
      return;
    }

    const pollId = this.id();
    const { name, selectedOptions } = this.form.getRawValue();
    const options = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions as string];

    this.pollService.vote(pollId, name as string, options as string[]).subscribe(() => {
      this.snackBar.open('Vote cast successfully!', 'Close', { duration: 3000 });
      localStorage.setItem(`poll_${pollId}_voter`, name as string);
      this.voted.set(true);
    });
  }
}

