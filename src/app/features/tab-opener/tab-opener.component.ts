import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TabGroupService } from '../tab-group';
import { SimpleTextComponent } from '../simple-text';

@Component({
  selector: 'app-tab-opener',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './tab-opener.component.html',
  styleUrls: ['./tab-opener.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabOpenerComponent {
  protected tabName: string = 'Tab';
  protected keepAlive: boolean = false;

  constructor(private readonly tabGroupService: TabGroupService) { }

  protected openTextAreaTab(): void {
    this.tabGroupService.addTab({
      name: this.tabName,
      portal: new ComponentPortal(SimpleTextComponent),
      keepAlive: this.keepAlive,
    })
  }
}
