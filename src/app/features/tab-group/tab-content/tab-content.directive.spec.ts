import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TabContentDirective } from './tab-content.directive';

describe('TabContentDirective', () => {
  let directive: TabContentDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabContentDirective]
    });
    directive = TestBed.inject(TabContentDirective);
  });

  it('should initialize with default active state as false', () => {
    expect(directive.active).toBeFalse();
  });

  it('should emit current active state through streamActive()', fakeAsync(async () => {
    const activeStates: boolean[] = [];
    directive.streamActive().subscribe(state => activeStates.push(state));

    tick(); // Initial state
    expect(activeStates).toEqual([false]);

    directive.active = true;
    directive.ngOnChanges();
    tick(); // Wait for asyncScheduler

    expect(activeStates).toEqual([false, true]);
  }));
});
