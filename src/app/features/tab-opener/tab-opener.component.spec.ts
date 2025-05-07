import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabGroupService } from '../tab-group';
import { TabOpenerComponent } from './tab-opener.component';
import { SimpleTextComponent } from '../examples/simple-text';
import { ChartComponent } from '../examples/chart';
import { MessagingHeaderComponent, MessagingComponent } from '../examples/messaging';
import { DestroyableInjector } from '../../common';

describe('TabOpenerComponent', () => {
  let fixture: ComponentFixture<TabOpenerComponent>;
  let mockTabGroupService: jasmine.SpyObj<TabGroupService>;

  beforeEach(async () => {
    mockTabGroupService = jasmine.createSpyObj('TabGroupService', ['addTab']);

    await TestBed.configureTestingModule({
      imports: [TabOpenerComponent],
      providers: [
        { provide: TabGroupService, useValue: mockTabGroupService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TabOpenerComponent);
    fixture.detectChanges();
  });

  it('should call TabGroupService.addTab with SimpleTextComponent when the Text Area button is clicked', () => {
    const tabName = 'Custom Tab Name';
    const input = fixture.debugElement.query(By.css('input[matInput]')).nativeElement;
    input.value = tabName;
    input.dispatchEvent(new Event('input'));

    const checkbox = fixture.debugElement.query(By.css('mat-checkbox input')).nativeElement;
    checkbox.click();
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button:nth-of-type(1)'));
    button.triggerEventHandler('click');

    expect(mockTabGroupService.addTab).toHaveBeenCalledWith({
      header: tabName,
      content: new ComponentPortal(SimpleTextComponent),
      keepAlive: true
    });
  });

  it('should call TabGroupService.addTab with ChartComponent when the Chart button is clicked', () => {
    const tabName = 'Custom Tab Name';
    const input = fixture.debugElement.query(By.css('input[matInput]')).nativeElement;
    input.value = tabName;
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button:nth-of-type(2)'));
    button.triggerEventHandler('click');

    expect(mockTabGroupService.addTab).toHaveBeenCalledWith({
      header: tabName,
      content: new ComponentPortal(ChartComponent),
      keepAlive: false
    });
  });

  it('should call TabGroupService.addTab with MessagingComponents when the Messaging button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button:nth-of-type(3)'));
    button.triggerEventHandler('click');

    const addTabCall = mockTabGroupService.addTab.calls.mostRecent().args[0];
    const headerComponentPortal = addTabCall.header as ComponentPortal<unknown>;
    const contentComponentPortal = addTabCall.content as ComponentPortal<unknown>;
    expect(headerComponentPortal instanceof ComponentPortal).toBeTruthy();
    expect(headerComponentPortal.component).toBe(MessagingHeaderComponent);
    expect(contentComponentPortal instanceof ComponentPortal).toBeTruthy();
    expect(contentComponentPortal.component).toBe(MessagingComponent);

    expect(headerComponentPortal.injector).toBe(contentComponentPortal.injector);
    const injectorDestroy = spyOn(headerComponentPortal.injector as DestroyableInjector, 'destroy');
    expect(typeof addTabCall.onDestroy).toBe('function');
    expect(() => {
      addTabCall.onDestroy!();
      expect(injectorDestroy).toHaveBeenCalled();
    }).not.toThrow();
  });
});
