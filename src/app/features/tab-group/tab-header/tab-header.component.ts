import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-tab-header',
  imports: [MatIconModule],
  templateUrl: './tab-header.component.html',
  styleUrl: './tab-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabHeaderComponent {
  name = input<string>('');
  close = output<void>();
}
