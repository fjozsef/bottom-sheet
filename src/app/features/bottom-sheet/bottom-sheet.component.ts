import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TabGroupComponent } from '../tab-group';

@Component({
  selector: 'app-bottom-sheet',
  imports: [TabGroupComponent],
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetComponent { }
