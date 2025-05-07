import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { MockResizeObserver } from '../../testing/mock-resize-observer';
import { SimpleTextComponent } from '../examples/simple-text';
import { Tab } from './tab';
import { TabGroupComponent } from './tab-group.component';
import { TabGroupService } from './tab-group.service';

const mockPortal = new ComponentPortal(SimpleTextComponent);

describe('TabGroupComponent', () => {
  let component: TabGroupComponent;
  let fixture: ComponentFixture<TabGroupComponent>;
  let mockTabGroupService: jasmine.SpyObj<TabGroupService>;
  let testScheduler: TestScheduler;

  beforeEach(async () => {
    mockTabGroupService = jasmine.createSpyObj('TabGroupService', ['streamTabs', 'removeTab']);
    mockTabGroupService.streamTabs.and.returnValue(of([]));

    window.ResizeObserver = MockResizeObserver;

    await TestBed.configureTestingModule({
      imports: [TabGroupComponent],
      providers: [
        { provide: TabGroupService, useValue: mockTabGroupService }
      ]
    })
      .overrideComponent(TabGroupComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();

    fixture = TestBed.createComponent(TabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  afterEach(() => {
    MockResizeObserver.observations = [];
  });

  describe('activeTab$', () => {
    it('should emit the active tab when there is one selected', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        const tab1: Tab = { header: 'Tab 1', content: mockPortal };
        const tab2: Tab = { header: 'Tab 2', content: mockPortal };

        mockTabGroupService.streamTabs.and.returnValue(cold('a', { a: [tab1, tab2] }));
        component.ngOnInit();
        component['selectTab'](tab1);

        expectObservable(component['activeTab$']).toBe('a', { a: tab1 });
      });
    });

    it('should emit null when there are no tabs', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        mockTabGroupService.streamTabs.and.returnValue(cold('a', { a: [] }));
        expectObservable(component['activeTab$']).toBe('a', { a: null });
      });
    });

  });

  it('should remove a tab when closeTab event is triggered from the header', () => {
    const tab1: Tab = { header: 'Tab 1', content: mockPortal };
    const tab2: Tab = { header: 'Tab 2', content: mockPortal };

    mockTabGroupService.streamTabs.and.returnValue(of([tab1, tab2]));
    component.ngOnInit();
    fixture.detectChanges();

    const tabHeaderComponents = fixture.debugElement.queryAll(By.css('.tab-header'));
    expect(tabHeaderComponents.length).toBe(2);

    tabHeaderComponents[0].triggerEventHandler('closeTab');

    expect(mockTabGroupService.removeTab).toHaveBeenCalledWith(tab1);
  });

  describe('navigational icons', () => {
    function getLeftButton() {
      return fixture.debugElement.query(By.css('.nav-icon[fontIcon="chevron_left"]'));
    }

    function getRightButton() {
      return fixture.debugElement.query(By.css('.nav-icon[fontIcon="chevron_right"]'));
    }

    it('should render left and right navigational icons when scrollable is true', () => {
      component['scrollable'] = signal(true);
      fixture.detectChanges();

      const leftIcon = getLeftButton()
      const rightIcon = getRightButton();

      expect(leftIcon).toBeTruthy();
      expect(rightIcon).toBeTruthy();
    });

    it('should not render navigational icons when scrollable is false', () => {
      component['scrollable'] = signal(false);
      fixture.detectChanges();

      const leftIcon = getLeftButton();
      const rightIcon = getRightButton();

      expect(leftIcon).toBeNull();
      expect(rightIcon).toBeNull();
    });

    it('should scroll to the left when left chevron is clicked (and there is space to the left)', () => {
      component['scrollable'] = signal(true);
      component['maxScrollPosition'] = signal(200);
      component['scrollPosition'] = signal(100);

      fixture.detectChanges();

      const leftIcon = getLeftButton();
      leftIcon.triggerEventHandler('click');

      expect(component['scrollPosition']()).toBe(50);
    });

    it('should not scroll to the left when left chevron is clicked (and there is nospace to the left)', () => {
      component['scrollable'] = signal(true);
      component['maxScrollPosition'] = signal(200);
      component['scrollPosition'] = signal(0);

      fixture.detectChanges();

      const leftIcon = getLeftButton();
      leftIcon.triggerEventHandler('click');

      expect(component['scrollPosition']()).toBe(0);
    });

    it('should scroll to the right when right chevron is clicked (and there is space to the right)', () => {
      component['scrollable'] = signal(true);
      component['maxScrollPosition'] = signal(200);
      component['scrollPosition'] = signal(10);

      fixture.detectChanges();

      const rightIcon = getRightButton();
      rightIcon.triggerEventHandler('click');

      expect(component['scrollPosition']()).toBe(60);
    });
  });

  describe('scrolling tab headers with mouse wheel', () => {
    function getTabHeaderContent() {
      return fixture.debugElement.query(By.css('.tab-header-content'));
    }

    it('should scroll to the left when wheeled up', () => {
      component['scrollable'] = signal(true);
      component['maxScrollPosition'] = signal(200);
      component['scrollPosition'] = signal(100);

      fixture.detectChanges();

      const tabHeaderContent = getTabHeaderContent();
      const wheelEvent = new WheelEvent('wheel', { deltaY: -20 });
      tabHeaderContent.nativeElement.dispatchEvent(wheelEvent);

      expect(component['scrollPosition']()).toBe(80);
    });

    it('should scroll to the right when wheeled down', () => {
      component['scrollable'] = signal(true);
      component['maxScrollPosition'] = signal(200);
      component['scrollPosition'] = signal(100);

      fixture.detectChanges();

      const tabHeaderContent = getTabHeaderContent();
      const wheelEvent = new WheelEvent('wheel', { deltaY: 20 });
      tabHeaderContent.nativeElement.dispatchEvent(wheelEvent);

      expect(component['scrollPosition']()).toBe(120);
    });
  });

  describe('canScrollLeft', () => {
    it('should return true when scrollPosition is greater than 0', () => {
      component['scrollPosition'] = signal(10);

      expect(component['canScrollLeft']()).toBeTrue();
    });

    it('should return false when scrollPosition is 0', () => {
      component['scrollPosition'] = signal(0);

      expect(component['canScrollLeft']()).toBeFalse();
    });
  });

  describe('canScrollRight', () => {
    it('should return true when scrollPosition is less than maxScrollPosition (signal test)', () => {
      component['scrollPosition'] = signal(10);
      component['maxScrollPosition'] = signal(20);

      expect(component['canScrollRight']()).toBeTrue();
    });

    it('should return true when scrollPosition is less than maxScrollPosition (mocked resize observer test)', () => {
      const tabHeaderContent: HTMLElement = fixture.debugElement.query(By.css('.tab-header-content')).nativeElement;
      const scrollContainer: HTMLElement = fixture.debugElement.query(By.css('.tab-header-scroll-container')).nativeElement;
      tabHeaderContent.style.minWidth = '500px';
      tabHeaderContent.style.maxWidth = '500px';
      scrollContainer.style.minWidth = '800px';
      scrollContainer.style.maxWidth = '800px';

      MockResizeObserver.triggerResizeEvent(tabHeaderContent);
      MockResizeObserver.triggerResizeEvent(scrollContainer);

      expect(component['canScrollRight']()).toBeTrue();
    });

    it('should return false when scrollPosition is equal to maxScrollPosition', () => {
      component['scrollPosition'] = signal(20);
      component['maxScrollPosition'] = signal(20);

      expect(component['canScrollRight']()).toBeFalse();
    });
  });
});
