type CacheTypes = any;
type CacheValue<C extends keyof CacheTypes> = CacheTypes[C];

/**
 * @typedef {Object} UseState
 * @template T
 * @property {T} data - The data property
 * @member {number} 100
 * @property {function(data: T): Promise<void>} set - The set method
 * @member {number} 200
 * @property {function(): Promise<void>} del - The del method
 * @member {number} 300
 */
export type UseState<T> = T & {
  /**
   * Set the state in cache.
   */
  set(data: Partial<T>): void | Promise<void>;
  /**
   * Delete the state from cache.
   */
  end(): void | Promise<void>;
  /**
   * Get the expiration time of the state in cache.
   * @returns {number} The expiration time in milliseconds.
   */
  getExpires(): number | Promise<number>;
};

export type StateData<C extends keyof CacheTypes> = CacheValue<C>['data'] & {
  id: string;
};

export type State<C extends keyof CacheTypes, Data = CacheValue<C>['data']> = {
  cache: C;
  expires: number;
  fetch?: boolean;
  onExpire?: (state: StateData<C>) => void | Promise<void>;
  get?: (state: StateData<C>) => Data | Promise<Data>;
  set?: (state: Data) => CacheValue<C>['data'] | Promise<CacheValue<C>['data']>;
};

export function createState<C extends keyof CacheTypes, D = CacheValue<C>['data']>(options: {
  cache: C;
  expires: number;
  fetch?: boolean;
  onExpire?: (state: StateData<C>) => void | Promise<void>;
  get?: (state: StateData<C>) => D | Promise<D>;
  set?: (state: D) => CacheValue<C>['data'] | Promise<CacheValue<C>['data']>;
}): State<C, D> {
  return {
    cache: options.cache,
    expires: options.expires,
    onExpire: options.onExpire,
    get: options.get,
    set: options.set,
  };
}
