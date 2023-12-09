import { type State } from '@/types';
import { UseState } from '@/types/State';
// import { ExtractStateData } from '@/types/EventModule';
import { getClients } from '@lib/utils';

export type ExtractStateData<T> = T extends State<any, infer D> ? D : unknown;

/**
 * Create an object that can be used to get, set, and delete data from state (cache).
 * **Queries the data on creation.**
 */
export async function createUseState<D, S extends State<any, any>>(
  state: S | undefined,
  id: string | undefined,
): Promise<UseState<ExtractStateData<S>>> {
  if (!id) throw new Error('Cannot query state without an id.');

  if (!state?.cache) return undefined!;

  const { cache } = await getClients();
  if (!cache) throw new Error('Cache client not created');

  const cached = await cache.get(state.cache, id);
  var data = state.get && cached ? await state.get(cached.data) : cached?.data;

  //If the state is still being used and updated, then extend the TTL
  if (cached) {
    await cache.set(state.cache, { id, expires: state.expires, data: cached.data });

    if (state.onExpire) {
      cache.addExpirationCallback(`${state.cache}:${id}`, () => {
        state.onExpire?.(state);
      });
    }
  }

  const set = async (value: D) => {
    if (!state?.set) return;

    const processedData = state?.set ? await state.set(data) : value;
    const processedValue = state?.set ? await state.set(value) : value;
    const newData = { ...processedData, ...processedValue };

    await cache.set(state.cache, { id, expires: state.expires, data: newData });

    Object.assign(state, newData);
  };

  if (state.onExpire) {
    cache.addExpirationCallback(`${state.cache}:${id}`, () => {
      state.onExpire?.(state);
    });
  }

  const end = async () => {
    await cache.delete(state.cache, id);
  };

  const getExpires = async () => {
    const cached = await cache.get(state.cache, id);
    return cached?.expires;
  };

  const useState = { ...data, id, set, end, getExpires };

  return useState;
}
