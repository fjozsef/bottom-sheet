import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tab-header',
  imports: [MatIconModule],
  templateUrl: './tab-header.component.html',
  styleUrl: './tab-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabHeaderComponent {
  closeTab = output<void>();
}
