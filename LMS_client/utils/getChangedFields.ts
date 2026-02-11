export function getChangedFields<T extends object>(
  newData: T,
  initialData?: Partial<T>,
): Partial<T> {
  if (!initialData) return newData;

  const changedEntries = Object.entries(newData).filter(([key, value]) => {
    const prevValue = initialData[key as keyof T];
    return value !== prevValue;
  });

  return Object.fromEntries(changedEntries) as Partial<T>;
}
