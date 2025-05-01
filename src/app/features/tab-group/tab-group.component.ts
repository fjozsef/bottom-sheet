import { PortalModule } from '@angular/cdk/portal';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, linkedSignal, OnInit, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from 'rxjs';

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

  protected tabHeaderContent = viewChild.required<ElementRef>('tabHeaderContent');
  protected scrollContainer = viewChild.required<ElementRef>('scrollContainer');

  private tabHeaderContentWidth = derivedAsync(() => this.observeElementWidth(this.tabHeaderContent()), { initialValue: 0 });
  private scrollContainerWidth = derivedAsync(() => this.observeElementWidth(this.scrollContainer()), { initialValue: 0 });
  private maxScrollPosition = computed(() => this.scrollContainerWidth() - this.tabHeaderContentWidth());
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

  // TODO: consider moving this to a utility function or a service
  private observeElementWidth(element: ElementRef<HTMLElement>): Observable<number> {
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
