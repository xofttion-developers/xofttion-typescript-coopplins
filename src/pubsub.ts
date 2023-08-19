import factoryInject, { Context, Injectable } from '@xofttion/dependency-injection';
import { Constructable } from '@xofttion/dependency-injection/types';
import { promiseFrom } from '@xofttion/utils';

type Voids = Promise<void[]>;
type Void = Promise<void>;
type Result = void | Void;

export abstract class Subscriber<T = unknown> {
  abstract execute(value: T): Result;
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

export function emitPubSub<T>(event: string, config: EmitConfig<T>): Voids {
  const subscriptions = events[event];

  if (subscriptions) {
    const { value, context } = config;

    return Promise.all(
      Array.from(subscriptions).map((token) => {
        const subcription = factoryInject({ config: { token, context } });

        return promiseFrom(subcription.execute(value));
      })
    );
  }

  return Promise.resolve([]);
}

@Injectable()
export class PubSub {
  constructor(private context?: Context) {}

  public emit<T = unknown>(event: string, value: T): Voids {
    return emitPubSub(event, { value, context: this.context });
  }
}
