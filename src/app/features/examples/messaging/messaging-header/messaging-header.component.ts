import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';

import { MessagingService } from '../messaging.service';

@Component({
  selector: 'app-messaging-header',
  imports: [AsyncPipe],
  templateUrl: './messaging-header.component.html',
  styleUrls: ['./messaging-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingHeaderComponent implements OnInit {
  protected messageCount$!: Observable<number>;

  constructor(private readonly messagingService: MessagingService) { }

  ngOnInit(): void {
    this.messageCount$ = this.messagingService.streamPendingMessages().pipe(
      map(messages => messages.length),
    );
  }
}
