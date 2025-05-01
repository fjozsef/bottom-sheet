import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabGroupService } from '../tab-group';
import { TabOpenerComponent } from './tab-opener.component';
import { SimpleTextComponent } from '../examples/simple-text';
import { ChartComponent } from '../examples/chart';

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
      name: tabName,
      portal: new ComponentPortal(SimpleTextComponent),
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
      name: tabName,
      portal: new ComponentPortal(ChartComponent),
      keepAlive: false
    });
  });
});
