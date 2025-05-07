import { Injector } from "@angular/core";

/**
 * TODO: Should be removed when Angular v20 is used
 * https://github.com/angular/angular/pull/60054
 */
export interface DestroyableInjector extends Injector {
  destroy(): void;
}
