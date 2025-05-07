import { ChangeDetectionStrategy, Component, Injector, Type } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TabGroupService } from '../tab-group';
import { SimpleTextComponent } from '../examples/simple-text';
import { ChartComponent } from '../examples/chart';
import { MessagingComponent, MessagingHeaderComponent, MessagingService } from '../examples/messaging';
import { DestroyableInjector } from '../../common';

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

  private openTab(component: Type<unknown>): void {
    this.tabGroupService.addTab({
      header: this.tabName,
      content: new ComponentPortal(component),
      keepAlive: this.keepAlive,
    });
  }

  protected openTextAreaTab(): void {
    this.openTab(SimpleTextComponent);
  }

  protected openChartTab(): void {
    this.openTab(ChartComponent);
  }

  protected openMessagingTab(): void {
    // TODO: Type casting should be removed once updated to Angular v20
    // https://github.com/angular/angular/pull/60054
    const injector = Injector.create({
      providers: [MessagingService],
    }) as DestroyableInjector;
    const header = new ComponentPortal(MessagingHeaderComponent, null, injector);
    const content = new ComponentPortal(MessagingComponent, null, injector);
    const tab = {
      header,
      content,
      keepAlive: this.keepAlive,
      onDestroy: () => injector.destroy()
    }
    this.tabGroupService.addTab(tab);
  }
}
