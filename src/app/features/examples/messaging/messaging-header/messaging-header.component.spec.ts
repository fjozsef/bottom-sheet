import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { Message } from '../message';
import { MessagingService } from '../messaging.service';
import { MessagingHeaderComponent } from './messaging-header.component';

describe('MessagingHeaderComponent', () => {
  let fixture: ComponentFixture<MessagingHeaderComponent>;
  let mockMessagingService: jasmine.SpyObj<MessagingService>;
  let pendingMessages$: BehaviorSubject<Message[]>;

  beforeEach(async () => {
    pendingMessages$ = new BehaviorSubject<Message[]>([]);
    mockMessagingService = jasmine.createSpyObj('MessagingService', ['streamPendingMessages']);
    mockMessagingService.streamPendingMessages.and.returnValue(pendingMessages$);

    await TestBed.configureTestingModule({
      imports: [MessagingHeaderComponent],
      providers: [
        { provide: MessagingService, useValue: mockMessagingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagingHeaderComponent);
    fixture.detectChanges();
  });

  it('should display initial content', () => {
    fixture.detectChanges();
    const hostElement: HTMLElement = fixture.debugElement.nativeElement!;
    expect(hostElement.textContent?.trim()).toBe('Messaging');
  });

  it('should update displayed count when messages change', () => {
    const messages: Message[] = [
      { id: 1, text: 'test1', timestamp: new Date() },
      { id: 2, text: 'test2', timestamp: new Date() }
    ];

    pendingMessages$.next(messages);
    fixture.detectChanges();
    const hostElement: HTMLElement = fixture.debugElement.nativeElement!;
    expect(hostElement.textContent?.trim()).toBe('Messaging (2)');

    const moreMessages: Message[] = [
      ...messages,
      { id: 3, text: 'test3', timestamp: new Date() }
    ];

    pendingMessages$.next(moreMessages);
    fixture.detectChanges();

    expect(hostElement.textContent?.trim()).toBe('Messaging (3)');
  });
});
