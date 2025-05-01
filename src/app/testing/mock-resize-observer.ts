export interface Observation {
  element: HTMLElement;
  resizeObserver: MockResizeObserver;
}

export class MockResizeObserver {
  static observations: Observation[] = [];

  observe(element: HTMLElement): void {
    MockResizeObserver.observations.push({ element, resizeObserver: this });
  }

  unobserve(element: HTMLElement): void {
    const index = MockResizeObserver.observations.findIndex(
      (obs) => obs.element === element
    );
    if (index !== -1) {
      MockResizeObserver.observations.splice(index, 1);
    }
  }

  disconnect(): void {
    MockResizeObserver.observations = [];
  }

  constructor(protected callback: ResizeObserverCallback) { }

  triggerResizeEvent(entries: ResizeObserverEntry[]) {
    this.callback(entries, this);
  }

  static triggerResizeEvent(element: HTMLElement): void {
    const observation = MockResizeObserver.observations.find(
      (obs) => obs.element === element
    );
    observation?.resizeObserver.triggerResizeEvent([
      { target: element, contentRect: element.getBoundingClientRect() } as unknown as ResizeObserverEntry,
    ]);
  }
}
