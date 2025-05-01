import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { Tab, TabGroupService } from './features/tab-group';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let mockTabGroupService: jasmine.SpyObj<TabGroupService>;

  beforeEach(async () => {
    mockTabGroupService = jasmine.createSpyObj('TabGroupService', ['streamTabs']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: TabGroupService, useValue: mockTabGroupService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideComponent(AppComponent, {
        set: {
          providers: []
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should render BottomSheetComponent when there is at least one tab', () => {
    mockTabGroupService.streamTabs.and.returnValue(of([{ name: 'Tab 1', portal: null } as unknown as Tab]));

    fixture.detectChanges();

    const bottomSheetElement = fixture.nativeElement.querySelector('app-bottom-sheet');
    expect(bottomSheetElement).toBeTruthy();
  });

  it('should not render BottomSheetComponent when there are no tabs', () => {
    mockTabGroupService.streamTabs.and.returnValue(of([]));

    fixture.detectChanges();

    const bottomSheetElement = fixture.nativeElement.querySelector('app-bottom-sheet');
    expect(bottomSheetElement).toBeNull();
  });
});
