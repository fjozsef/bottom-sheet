import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-chart',
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent {
  view: [number, number] = [700, 400];
  single = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];

  colorScheme: Color = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    name: 'Custom Scheme',
    selectable: true,
    group: ScaleType.Ordinal
  };
}
