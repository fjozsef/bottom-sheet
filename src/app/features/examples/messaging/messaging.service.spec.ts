import { TestBed } from '@angular/core/testing';

import { MessagingService } from './messaging.service';
import { Message } from './message';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(() => {
    jasmine.clock().install();
    TestBed.configureTestingModule({
      providers: [MessagingService]
    });
    service = TestBed.inject(MessagingService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    service.ngOnDestroy();
  });

  it('should generate new messages every 3 seconds', () => {
    let messages: Message[] = [];
    const subscription = service.streamPendingMessages().subscribe(msgs => messages = msgs);
    jasmine.clock().tick(3000);
    expect(messages.length).toBe(1);
    expect(messages[0].id).toBe(1);
    jasmine.clock().tick(3000);
    expect(messages.length).toBe(2);
    expect(messages[1].id).toBe(2);
    subscription.unsubscribe();
  });

  it('should stream new messages when subscribed to streamMessage', () => {
    const messages: Message[] = [];
    service.streamNewMessage().subscribe(msg => messages.push(msg));

    jasmine.clock().tick(3000);
    expect(messages.length).toBe(1);
    expect(messages[0].id).toBe(1);

    jasmine.clock().tick(3000);
    expect(messages.length).toBe(2);
    expect(messages[1].id).toBe(2);
  });

  it('should accumulate pending messages when not streaming', () => {
    jasmine.clock().tick(9000); // Wait for 3 messages to be generated

    let pendingMessages: Message[] = [];
    const subscription = service.streamPendingMessages().subscribe(msgs => pendingMessages = msgs);
    expect(pendingMessages.length).toBe(3);
    expect(pendingMessages.map(message => message.id)).toEqual([1, 2, 3]);

    subscription.unsubscribe();
  });

  it('should clear the pending queue when consumeMessages is called', () => {
    jasmine.clock().tick(3000); // Wait for 3 messages to be generated

    let pendingMessages: Message[] = [];
    const subscription = service.streamPendingMessages().subscribe(msgs => pendingMessages = msgs);
    expect(pendingMessages.length).toBe(1);

    service.consumeMessages();
    expect(pendingMessages.length).toBe(0);
    subscription.unsubscribe();
  });

  it('should not accumulate messages when streaming', () => {
    const streamedMessages: Message[] = [];
    service.streamNewMessage().subscribe(msg => streamedMessages.push(msg));

    let pendingMessages: Message[] = [];
    const subscription = service.streamPendingMessages().subscribe(msgs => pendingMessages = msgs);

    jasmine.clock().tick(9000); // Wait for 3 messages to be generated

    expect(pendingMessages.length).toBe(0);
    expect(streamedMessages.length).toBe(3);
    subscription.unsubscribe();
  });

  describe('onDestroy', () => {
    it('should complete pendingMessages Subject', () => {
      const pendingComplete = jasmine.createSpy('pendingComplete');
      service.streamPendingMessages().subscribe({ complete: pendingComplete });
      service.ngOnDestroy();
      expect(pendingComplete).toHaveBeenCalled();
    });

    it('should complete newMessage Subject', () => {
      const newMessageComplete = jasmine.createSpy('newMessageComplete');
      service.streamNewMessage().subscribe({ complete: newMessageComplete });
      service.ngOnDestroy();
      expect(newMessageComplete).toHaveBeenCalled();
    });

    it('should not generate new messages anymore', () => {
      service.ngOnDestroy();
      jasmine.clock().tick(10000);
      expect(service.consumeMessages()).toEqual([]);
    })
  });
});
