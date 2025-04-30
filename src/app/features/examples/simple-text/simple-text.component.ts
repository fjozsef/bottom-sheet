import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-simple-text',
  templateUrl: './simple-text.component.html',
  styleUrls: ['./simple-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleTextComponent {
}
