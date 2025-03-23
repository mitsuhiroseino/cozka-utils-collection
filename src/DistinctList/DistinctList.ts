import isFunction from 'lodash-es/isFunction';
import { DistinctArrayOptions } from './types';

/**
 * 重複した要素を持たないリスト
 */
export default class DistinctList<I> {
  /**
   * 追加された要素
   */
  private _items: Map<unknown, I>;

  /**
   * IDを取得するための関数
   */
  private _getId: (item: I) => unknown;

  /**
   * 要素を追加するための関数
   */
  private _add: (item: I, id: unknown) => boolean;

  get length(): number {
    return this._items.size;
  }

  constructor(options: DistinctArrayOptions<I> = {}) {
    const me = this;
    const { idKey, duplicateMode, items } = options;
    // IDを取得する関数
    me._getId =
      idKey == null
        ? (item: I) => item
        : isFunction(idKey)
          ? idKey
          : (item: I) => item[idKey];
    // 要素を追加する関数
    me._add =
      duplicateMode === 'overwrite'
        ? (item: I, id: unknown) => {
            // 重複していても上書き
            me._items.set(id, item);
            return true;
          }
        : duplicateMode === 'reinsert'
          ? (item: I, id: unknown) => {
              // 重複している場合は削除して追加
              if (me._items.has(id)) {
                me._items.delete(id);
              }
              me._items.set(id, item);
              return true;
            }
          : (item: I, id: unknown) => {
              // 重複している場合は追加しない
              if (!me._items.has(id)) {
                me._items.set(id, item);
                return true;
              }
              return false;
            };
    // Mapの初期化
    if (items) {
      me._items = new Map(items.map((item) => [me._getId(item), item]));
    } else {
      me._items = new Map();
    }
  }

  add(item: I) {
    const id = this._getId(item);
    return this._add(item, id);
  }

  addAll(items: I[]) {
    for (const item of items) {
      this.add(item);
    }
  }

  has(id: unknown) {
    return this._items.has(id);
  }

  delete(id: unknown) {
    if (this.has(id)) {
      this._items.delete(id);
      return true;
    }
    return false;
  }

  clear() {
    this._items.clear();
  }

  toArray(): I[] {
    return new Array(...this._items.values());
  }

  forEach(callback: Parameters<Map<unknown, I>['forEach']>[0]) {
    this._items.forEach(callback);
  }

  map(callback: Parameters<MapIterator<I>['map']>[0]) {
    this._items.values().map(callback);
  }

  [Symbol.iterator]() {
    return this._items[Symbol.iterator]();
  }
}
