export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  if (!keys.length) return obj
  const { [keys.pop()!]: omitted, ...rest } = obj
  return omit(rest, keys as any) as any
}
