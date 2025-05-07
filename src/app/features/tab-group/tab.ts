import { Portal } from "@angular/cdk/portal";

export interface Tab {
  header: string | Portal<unknown>;
  content: Portal<unknown>;
  keepAlive?: boolean;
  onDestroy?: () => void
}
