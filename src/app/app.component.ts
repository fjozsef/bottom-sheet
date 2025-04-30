import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { distinctUntilChanged, map, Observable } from 'rxjs';

import { BottomSheetComponent } from './features/bottom-sheet';
import { TabOpenerComponent } from './features/tab-opener';
import { TabGroupService } from './features/tab-group';

@Component({
  selector: 'app-root',
  imports: [BottomSheetComponent, TabOpenerComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TabGroupService],
})
export class AppComponent implements OnInit {

  protected hasTabs$!: Observable<boolean>;

  constructor(private readonly tabGroupService: TabGroupService) { }

  ngOnInit(): void {
    this.hasTabs$ = this.tabGroupService.streamTabs().pipe(
      map((tabs) => tabs.length > 0),
      distinctUntilChanged(),
    );
  }
}
