export type MapFactoryType<T extends object, R> = {
  [K in keyof T]?: (value: T[K]) => R
}

export type MapFactoryResult<T extends object, R> = {
  [K in keyof T]: R
}

type Entries<T extends object> = Array<[keyof T, T[keyof T]]>

/**
 * Converts object values using the fabric object
 * @param target - target object
 * @param factory - transform factory
 */
export const mapFactory = <T extends object, R>(
  target: T,
  factory: MapFactoryType<T, R>,
) => {
  const mapped: MapFactoryResult<T, R> = Object.create(null)
  for (const [key, value] of Object.entries(target) as Entries<T>)
    mapped[key] = factory[key]?.(value) ?? mapped[key]
  return mapped
}
