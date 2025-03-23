import rebuild from '../rebuild';
import { CleanOptions } from './types';

function cleanFn<T>(arg: T): T | undefined {
  return arg == null ? undefined : arg;
}

/**`
 * undefinedの要素を削除する。
 * @param target
 */
export default function clean(target: any, options: CleanOptions = {}): any {
  const { removeNull, ...rest } = options;
const    fn = removeNull ? cleanFn : (item) => item;
  return rebuild(target, fn, rest);
}
