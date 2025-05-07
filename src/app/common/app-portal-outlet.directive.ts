import { CdkPortalOutlet, ComponentPortal, Portal } from "@angular/cdk/portal"
import { ComponentRef, Directive, inject, Injector, Input, ViewContainerRef } from "@angular/core";

import { MergeInjector } from "../utils/merge-injector";

/**
 * Similar to the CdkPortalOutlet, but for ComponentPortals the ViewContainerRef's injector is used as a fallback
 * even when the portal has its own injector
 */
@Directive({
  selector: '[appPortalOutlet]'
})
export class AppPortalOutletDirective extends CdkPortalOutlet {
  protected viewContainerRef = inject(ViewContainerRef);

  @Input('appPortalOutlet')
  override set portal(portal: Portal<unknown>) {
    super.portal = portal;
  }

  override attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    let injector: Injector;
    if (portal.injector) {
      injector = new MergeInjector(portal.injector, this.viewContainerRef.injector);
    } else {
      injector = this.viewContainerRef.injector;
    }

    const alteredPortal = new ComponentPortal(portal.component, portal.viewContainerRef, injector, portal.componentFactoryResolver, portal.projectableNodes)
    return super.attachComponentPortal(alteredPortal);
  }
}
