import { PortalModule } from '@angular/cdk/portal';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, linkedSignal, OnInit, signal, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { BehaviorSubject, combineLatest, map, Observable, of, shareReplay } from 'rxjs';

import { derivedAsync } from 'ngxtension/derived-async';

import { Tab } from './tab';
import { TabGroupService } from './tab-group.service';
import { TabHeaderComponent } from './tab-header';

@Component({
  selector: 'app-tab-group',
  imports: [AsyncPipe, TabHeaderComponent, PortalModule, MatIconModule],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabGroupComponent implements OnInit {
  protected tabs$!: Observable<Tab[]>;
  protected activeTab$!: Observable<Tab | null>;
  private readonly lastSelectedTab$ = new BehaviorSubject<Tab | null>(null);
  private readonly buttonScrollDelta = 50;

  protected tabHeader = viewChild<ElementRef>('tabHeader');
  protected scrollContainer = viewChild<ElementRef>('scrollContainer');

  protected mainContainerWidth = derivedAsync(() => this.observeElementWidth(this.tabHeader()), { initialValue: 0 });
  protected scrollContainerWidth = derivedAsync(() => this.observeElementWidth(this.scrollContainer()), { initialValue: 0 });
  protected maxScrollPosition = computed(() => this.scrollContainerWidth() - this.mainContainerWidth());
  protected scrollable = computed(() => this.maxScrollPosition() > 0);
  protected scrollPosition = linkedSignal<boolean, number>({
    source: this.scrollable,
    computation: () => 0,
  });
  protected canScrollLeft = computed(() => this.scrollPosition() > 0);
  protected canScrollRight = computed(() => this.scrollPosition() < this.maxScrollPosition());

  constructor(private readonly tabGroupService: TabGroupService) { }

  public ngOnInit(): void {
    this.tabs$ = this.tabGroupService.streamTabs();

    this.activeTab$ = combineLatest([
      this.tabs$,
      this.lastSelectedTab$
    ]).pipe(
      map(([tabs, lastSelectedTab]) => {
        const activeTab = tabs.find((tab) => tab === lastSelectedTab) || tabs[0];
        return activeTab || null;
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  protected selectTab(tab: Tab): void {
    this.lastSelectedTab$.next(tab);
  }

  protected removeTab(tab: Tab): void {
    this.tabGroupService.removeTab(tab);
  }

  protected scrollLeft(): void {
    this.scrollRightBy(-this.buttonScrollDelta);
  }

  protected scrollRight(): void {
    this.scrollRightBy(this.buttonScrollDelta);
  }

  protected onWheel(event: WheelEvent): void {
    event.preventDefault();
    this.scrollRightBy(event.deltaY);
  }

  private scrollRightBy(delta: number): void {
    const currentPosition = this.scrollPosition();
    const maxPosition = this.maxScrollPosition();
    const newPosition = Math.max(0, Math.min(currentPosition + delta, maxPosition));
    if (newPosition !== currentPosition) {
      this.scrollPosition.set(newPosition);
    }
  }

  private observeElementWidth(element: ElementRef<HTMLElement> | undefined): Observable<number> {
    if (!element) {
      return of(0);
    }
    return new Observable<number>((observer) => {
      const initialWidth = element.nativeElement.getBoundingClientRect().width;
      observer.next(initialWidth);

      const resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0].contentRect.width;
        observer.next(width);
      });

      resizeObserver.observe(element.nativeElement);

      return () => resizeObserver.disconnect();
    }).pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

}
