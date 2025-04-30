import { Portal } from "@angular/cdk/portal";

export interface Tab {
  name: string;
  portal: Portal<unknown>;
  keepAlive?: boolean;
}
