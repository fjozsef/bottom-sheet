import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EMPTY, map, Observable, scan, shareReplay, startWith, switchMap } from 'rxjs';

import { TabContentDirective } from '../../tab-group';
import { Message } from './message';
import { MessagingService } from './messaging.service';

@Component({
  selector: 'app-messaging',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagingComponent implements OnInit {
  protected messages$!: Observable<Message[]>;

  constructor(
    private readonly messagingService: MessagingService,
    private readonly tabContent: TabContentDirective
  ) { }

  public ngOnInit(): void {
    this.messages$ = this.tabContent.streamActive().pipe(
      switchMap(active => {
        if (!active) {
          return EMPTY;
        }
        const pendingMessages = this.messagingService.consumeMessages();

        return this.messagingService.streamNewMessage().pipe(
          map((message) => ([message])),
          startWith(pendingMessages)
        );
      }),
      scan((messages, message) => ([...messages, ...message]), [] as Message[]),
      startWith([] as Message[]),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  }
}
