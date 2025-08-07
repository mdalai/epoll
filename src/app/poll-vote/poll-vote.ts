import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
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
  private readonly formBuilder = inject(FormBuilder);
  private readonly pollService = inject(PollService);
  private readonly snackBar = inject(MatSnackBar);

  form = this.formBuilder.group({
    name: ['', Validators.required],
    option: ['', Validators.required],
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
        // Check if user has already voted
        const name = localStorage.getItem(`poll_${pollId}_voter`);
        if (name) {
          this.form.controls.name.setValue(name);
          this.form.controls.name.disable();
        }
      });
    });
  }

  vote(): void {
    if (this.form.invalid) {
      return;
    }

    const pollId = this.id();
    const { name, option } = this.form.getRawValue();
    this.pollService.vote(pollId, name as string, option as string).subscribe(() => {
      this.snackBar.open('Vote cast successfully!', 'Close', { duration: 3000 });
      localStorage.setItem(`poll_${pollId}_voter`, name as string);
    });
  }
}
