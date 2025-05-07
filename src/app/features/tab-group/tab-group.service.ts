import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { Tab } from './tab';

@Injectable()
export class TabGroupService {
  private readonly tabs$ = new BehaviorSubject<Tab[]>([]);

  addTab(tab: Tab): void {
    const currentTabs = this.tabs$.getValue();
    this.tabs$.next([...currentTabs, tab]);
  }

  removeTab(tab: Tab): void {
    const currentTabs = this.tabs$.getValue();
    const newTabs = currentTabs.filter(t => t !== tab);
    tab.onDestroy?.();
    this.tabs$.next(newTabs);
  }

  getTabs(): Tab[] {
    return this.tabs$.getValue();
  }

  streamTabs(): Observable<Tab[]> {
    return this.tabs$.asObservable();
  }
}
