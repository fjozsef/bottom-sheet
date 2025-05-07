import { Directive, Input, OnChanges } from '@angular/core';
import { asyncScheduler, BehaviorSubject, Observable } from 'rxjs';

@Directive({
  selector: '[appTabContent]',
})
export class TabContentDirective implements OnChanges {
  @Input() active = false;

  private readonly active$ = new BehaviorSubject<boolean>(this.active);

  ngOnChanges(): void {
    asyncScheduler.schedule(() => {
      this.active$.next(this.active);
    })
  }

  public streamActive(): Observable<boolean> {
    return this.active$.asObservable();
  }
}
