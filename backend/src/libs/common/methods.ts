export function isEqualArrayByProp<T>(
  arr1: T[],
  arr2: T[],
  compareProps: (keyof T)[],
): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((obj1, i) => {
    const obj2 = arr2[i];
    return compareProps.every(
      (prop) => String(obj1[prop]) === String(obj2[prop]),
    );
  });
}

export function isEqualStringArray(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const set1 = new Set(arr1);
  return arr2.every((uuid) => set1.has(uuid));
}

export function getRandomElement<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min); // Ensure min is an integer (inclusive)
  max = Math.floor(max); // Ensure max is an integer (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
