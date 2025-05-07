import { Injectable, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription, Subject, BehaviorSubject } from 'rxjs';

import { Message } from './message';

@Injectable()
export class MessagingService implements OnDestroy {
  private pendingMessages$ = new BehaviorSubject<Message[]>([]);
  private messageCounter = 0;
  private newMessage$ = new Subject<Message>();
  private timerSubscription: Subscription;

  constructor() {
    this.timerSubscription = interval(3000).subscribe(() => {
      this.generateNewMessage();
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
    this.pendingMessages$.complete();
    this.newMessage$.complete();
  }

  consumeMessages(): Message[] {
    const messages = this.pendingMessages$.value;
    this.pendingMessages$.next([]);
    return messages;
  }

  streamPendingMessages(): Observable<Message[]> {
    return this.pendingMessages$.asObservable();
  }

  streamNewMessage(): Observable<Message> {
    return this.newMessage$.asObservable();
  }

  private generateNewMessage(): void {
    const newMessage: Message = {
      id: ++this.messageCounter,
      text: `Message #${this.messageCounter} generated at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date()
    };
    if (this.newMessage$.observed) {
      this.newMessage$.next(newMessage);
    } else {
      const currentMessages = this.pendingMessages$.value;
      this.pendingMessages$.next([...currentMessages, newMessage]);
    }
  }
}
