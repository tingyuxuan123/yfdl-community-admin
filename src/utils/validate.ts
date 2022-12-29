/**
 *
 * @param path 链接
 * @returns 返回该链接是否合法
 */
export function isExternal(path: any) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
