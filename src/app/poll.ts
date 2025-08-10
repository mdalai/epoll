import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDocs, query, runTransaction, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Poll } from './poll.model';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private readonly firestore = inject(Firestore);
  private readonly collection = collection(this.firestore, 'polls');

  createPoll(poll: Omit<Poll, 'id'>): Observable<string> {
    return from(addDoc(this.collection, poll).then(docRef => docRef.id));
  }

  updatePoll(poll: Poll): Observable<void> {
    const pollDocRef = doc(this.firestore, `polls/${poll.id}`);
    const { id, ...data } = poll;
    return from(updateDoc(pollDocRef, data));
  }

  updatePollStatus(pollId: string, status: 'active' | 'paused'): Observable<void> {
    const pollDocRef = doc(this.firestore, `polls/${pollId}`);
    return from(updateDoc(pollDocRef, { status }));
  }

  getPolls(): Observable<Poll[]> {
    return collectionData(this.collection, { idField: 'id' }) as Observable<Poll[]>;
  }

  getPoll(pollId: string): Observable<Poll> {
    const pollDocRef = doc(this.firestore, `polls/${pollId}`);
    return docData(pollDocRef, { idField: 'id' }) as Observable<Poll>;
  }

  hasVoted(pollId: string, userId: string): Observable<boolean> {
    const voteCollection = collection(this.firestore, 'votes');
    const q = query(voteCollection, where('pollId', '==', pollId), where('userId', '==', userId));
    return from(getDocs(q).then(snapshot => !snapshot.empty));
  }

  vote(pollId: string, userId: string, optionNames: string[]): Observable<void> {
    const pollDocRef = doc(this.firestore, `polls/${pollId}`);

    return from(runTransaction(this.firestore, async (transaction) => {
      const pollDoc = await transaction.get(pollDocRef);
      if (!pollDoc.exists()) {
        throw new Error('Poll does not exist!');
      }

      const poll = pollDoc.data() as Poll;

      // Check if user has already voted
      const voteCollection = collection(this.firestore, 'votes');
      const q = query(voteCollection, where('pollId', '==', pollId), where('userId', '==', userId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // New vote
        for (const optionName of optionNames) {
          const optionIndex = poll.options.findIndex(o => o.name === optionName);
          if (optionIndex !== -1) {
            poll.options[optionIndex].votes++;
          }
        }
        transaction.update(pollDocRef, { options: poll.options });
        const voteDoc = doc(collection(this.firestore, 'votes'));
        transaction.set(voteDoc, { pollId, userId, options: optionNames });
      } else if (poll.settings.allowVoteChange) {
        // Change existing vote
        const previousVoteDoc = snapshot.docs[0];
        const previousOptionNames = previousVoteDoc.data()['options'] as string[];

        for (const optionName of previousOptionNames) {
            const previousOptionIndex = poll.options.findIndex(o => o.name === optionName);
            if (previousOptionIndex !== -1) {
                poll.options[previousOptionIndex].votes--
            }
        }

        for (const optionName of optionNames) {
            const optionIndex = poll.options.findIndex(o => o.name === optionName);
            if (optionIndex !== -1) {
                poll.options[optionIndex].votes++;
            }
        }

        transaction.update(pollDocRef, { options: poll.options });
        transaction.update(previousVoteDoc.ref, { options: optionNames });
      } else {
        throw new Error('You have already voted on this poll.');
      }
    }));
  }

  deletePoll(pollId: string): Observable<void> {
    const pollDocRef = doc(this.firestore, `polls/${pollId}`);
    return from(deleteDoc(pollDocRef));
  }
}
