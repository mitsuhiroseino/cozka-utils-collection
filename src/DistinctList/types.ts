export type DistinctArrayOptions<I> = {
  /**
   * 重複していることを判定するためのプロパティ
   * 未指定の場合は要素そのもので重複を判定
   */
  idKey?: string | number | ((item: I) => unknown);

  /**
   * 重複した要素が追加された場合の動作
   *
   * - ignore: 追加しない
   * - overwrite: 追加済みの物を新しいもので置き換え
   * - reinsert: 追加済みの物を削除して新しいものを追加
   *
   * default: ignore
   */
  duplicateMode?: 'ignore' | 'overwrite' | 'reinsert';

  /**
   * 初期要素
   */
  items?: I[];
};
