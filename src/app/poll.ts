import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
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

  vote(pollId: string, userId: string, option: string): Observable<void> {
    const voteCollection = collection(this.firestore, 'votes');
    const q = query(voteCollection, where('pollId', '==', pollId), where('userId', '==', userId));
    return from((async () => {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        await addDoc(voteCollection, { pollId, userId, option });
      } else {
        const voteDoc = snapshot.docs[0];
        await updateDoc(voteDoc.ref, { option });
      }
    })());
  }

  deletePoll(pollId: string): Observable<void> {
    const pollDocRef = doc(this.firestore, `polls/${pollId}`);
    return from(deleteDoc(pollDocRef));
  }
}
