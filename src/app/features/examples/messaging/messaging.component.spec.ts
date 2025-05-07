import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject, of } from 'rxjs';

import { MessagingComponent } from './messaging.component';
import { MessagingService } from './messaging.service';
import { TabContentDirective } from '../../tab-group';
import { Message } from './message';

describe('MessagingComponent', () => {
  let component: MessagingComponent;
  let fixture: ComponentFixture<MessagingComponent>;
  let mockMessagingService: jasmine.SpyObj<MessagingService>;
  let mockTabContent: jasmine.SpyObj<TabContentDirective>;
  let tabActive$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    mockMessagingService = jasmine.createSpyObj('MessagingService', ['consumeMessages', 'streamNewMessage']);
    tabActive$ = new BehaviorSubject<boolean>(false);
    mockTabContent = jasmine.createSpyObj('TabContentDirective', [], {
      streamActive: () => tabActive$.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [MessagingComponent],
      providers: [
        { provide: MessagingService, useValue: mockMessagingService },
        { provide: TabContentDirective, useValue: mockTabContent }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagingComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    tabActive$.complete();
  });

  it('should not process messages when tab is not active', () => {
    const pendingMessages: Message[] = [{ id: 1, text: 'pending', timestamp: new Date() }];
    mockMessagingService.consumeMessages.and.returnValue(pendingMessages);

    tabActive$.next(false);
    fixture.detectChanges();

    const subscription = component['messages$'].subscribe();

    expect(mockMessagingService.consumeMessages).not.toHaveBeenCalled();
    subscription.unsubscribe();
  });

  it('should load pending messages and start streaming when tab becomes active', () => {
    const pendingMessages: Message[] = [
      { id: 1, text: 'pending1', timestamp: new Date() },
      { id: 2, text: 'pending2', timestamp: new Date() }
    ];
    const newMessage: Message = { id: 3, text: 'new', timestamp: new Date() };

    mockMessagingService.consumeMessages.and.returnValue(pendingMessages);
    mockMessagingService.streamNewMessage.and.returnValue(of(newMessage));

    tabActive$.next(true);
    fixture.detectChanges();

    let messages: Message[] = [];

    const subscription = component['messages$'].subscribe(newMessages => {
      messages = newMessages;
    });
    subscription.unsubscribe();

    expect(messages).toEqual([...pendingMessages, newMessage]);
    expect(mockMessagingService.consumeMessages).toHaveBeenCalled();
    expect(mockMessagingService.streamNewMessage).toHaveBeenCalled();
  });

  it('should accumulate messages over time', () => {
    const message$ = new Subject<Message>();
    const pendingMessages: Message[] = [{ id: 1, text: 'pending', timestamp: new Date() }];
    const newMessage1: Message = { id: 2, text: 'new1', timestamp: new Date() };
    const newMessage2: Message = { id: 3, text: 'new2', timestamp: new Date() };

    mockMessagingService.consumeMessages.and.returnValue(pendingMessages);
    mockMessagingService.streamNewMessage.and.returnValue(message$.asObservable());

    tabActive$.next(true);
    fixture.detectChanges();

    let messages: Message[] = [];

    const subscription = component['messages$'].subscribe(newMessages => {
      messages = newMessages;
    });

    message$.next(newMessage1);
    expect(messages).toEqual([...pendingMessages, newMessage1])
    message$.next(newMessage2);
    expect(messages).toEqual([...pendingMessages, newMessage1, newMessage2])
    subscription.unsubscribe();
  });
});
