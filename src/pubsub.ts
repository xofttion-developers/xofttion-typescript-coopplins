import factoryInject, { Context, Injectable } from '@xofttion/dependency-injection';
import { Constructable } from '@xofttion/dependency-injection/types';

export abstract class Subscriber<T = unknown> {
  abstract execute(value: T): void;
}

type Subscription = Constructable<Subscriber>;

interface EmitConfig<T = unknown> {
  value: T;
  context?: Context;
}

const events: Record<string, Set<Subscription>> = {};

export function registerPubSub(event: string, subscription: Subscription): void {
  if (!events[event]) {
    events[event] = new Set();
  }

  events[event].add(subscription);
}

export function emitPubSub<T = unknown>(event: string, config: EmitConfig<T>): void {
  const subscriptions = events[event];

  if (subscriptions) {
    const { value, context } = config;

    subscriptions.forEach((token) => {
      const subcription = factoryInject({ config: { token, context } });

      subcription.execute(value);
    });
  }
}

@Injectable()
export class PubSub {
  constructor(private context?: Context) {}

  public emit<T = unknown>(event: string, value: T): void {
    const { context } = this;

    emitPubSub(event, { value, context });
  }
}
