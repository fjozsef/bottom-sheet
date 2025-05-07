import { CdkPortalOutlet, ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Injector, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AppPortalOutletDirective } from './app-portal-outlet.directive';

describe('AppPortalOutletDirective', () => {

  let directive: AppPortalOutletDirective;
  let viewContainerRef: ViewContainerRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPortalOutletDirective],
      providers: [
        AppPortalOutletDirective,
        {
          provide: ViewContainerRef, useValue: {
            injector: Injector.create({
              providers: [
                { provide: 'VIEW_TOKEN', useValue: 'view' },
              ]
            })
          }
        },
      ]
    });

    directive = TestBed.inject(AppPortalOutletDirective);
    viewContainerRef = TestBed.inject(ViewContainerRef);
  });

  it('should use viewContainerRef injector when portal has no injector', () => {
    const portal = new ComponentPortal(null!);
    const spy = spyOn(CdkPortalOutlet.prototype, 'attachComponentPortal');

    directive.attachComponentPortal(portal)

    expect(spy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        injector: viewContainerRef.injector
      })
    );
  });

  it('should combine injectors when portal has its own injector', () => {
    const portalInjector = Injector.create({
      providers: [{ provide: 'TEST_TOKEN', useValue: 'test' }]
    });
    const portal = new ComponentPortal(null!, null, portalInjector);
    const spy = spyOn(CdkPortalOutlet.prototype, 'attachComponentPortal');
    directive.attachComponentPortal(portal)

    const alteredPortalInjector = spy.calls.mostRecent().args[0].injector;
    expect(alteredPortalInjector?.get('TEST_TOKEN')).toBe('test');
    expect(alteredPortalInjector?.get('VIEW_TOKEN')).toBe('view');
  });

  it('should preserve other portal properties when creating altered portal', () => {
    const component = {} as ComponentType<unknown>;
    const injector = Injector.create({ providers: [] });
    const projectableNodes = [[document.createElement('div')]];
    const portal = new ComponentPortal(
      component,
      viewContainerRef,
      injector,
      null,
      projectableNodes
    );

    const spy = spyOn(CdkPortalOutlet.prototype, 'attachComponentPortal');
    directive.attachComponentPortal(portal);

    expect(spy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        component,
        viewContainerRef,
        projectableNodes: projectableNodes
      })
    );
  });
});
