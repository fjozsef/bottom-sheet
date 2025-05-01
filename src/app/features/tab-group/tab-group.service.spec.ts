import { TestBed } from '@angular/core/testing';
import { Portal } from '@angular/cdk/portal';
import { TestScheduler } from 'rxjs/testing';

import { TabGroupService } from './tab-group.service';
import { Tab } from './tab';

describe('TabGroupService', () => {
  let service: TabGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabGroupService]
    });
    service = TestBed.inject(TabGroupService);
  });

  it('should add a tab', () => {
    const tab: Tab = { name: 'Tab 1', portal: {} as Portal<unknown> };
    service.addTab(tab);
    expect(service.getTabs()).toContain(tab);
  });

  it('should remove a tab', () => {
    const tab1: Tab = { name: 'Tab 1', portal: {} as Portal<unknown> };
    const tab2: Tab = { name: 'Tab 2', portal: {} as Portal<unknown> };
    service.addTab(tab1);
    service.addTab(tab2);
    service.removeTab(tab1);
    expect(service.getTabs()).not.toContain(tab1);
    expect(service.getTabs()).toContain(tab2);
  });

  it('should return all tabs', () => {
    const tab1: Tab = { name: 'Tab 1', portal: {} as Portal<unknown> };
    const tab2: Tab = { name: 'Tab 2', portal: {} as Portal<unknown> };
    service.addTab(tab1);
    service.addTab(tab2);
    expect(service.getTabs()).toEqual([tab1, tab2]);
  });

  it('should stream tabs as an observable', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    testScheduler.run(({ expectObservable }) => {
      const tab: Tab = { name: 'Tab 1', portal: {} as Portal<unknown> };
      service.addTab(tab);
      expectObservable(service.streamTabs()).toBe('a', { a: [tab] });
    });
  });
});
