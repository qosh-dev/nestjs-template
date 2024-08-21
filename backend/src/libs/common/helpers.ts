export function getEnumValuesOrKeys<T extends Record<string, string | number>>(
  enumType: T,
  options?: {
    allow?: (keyof T)[];
    except?: (keyof T)[];
    return?: 'keys' | 'values';
  },
) {
  const keys = Object.keys(enumType) as (keyof T)[];
  let filteredKeys: (keyof T)[];
  if (options && options.allow) {
    filteredKeys = keys.filter((key) => options.allow.includes(key));
  } else if (options && options.except) {
    filteredKeys = keys.filter((key) => !options.except.includes(key));
  } else {
    filteredKeys = keys;
  }
  return filteredKeys.map((key) =>
    options && options.return === 'keys' ? key : enumType[key],
  );
}

export function isArraysEqual(arr1: string[], arr2: string[]): boolean {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Compare each element using strict equality (===)
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function fixNum(num: number, fractionDigits = 2) {
  return Number(num.toFixed(fractionDigits));
}

export const randomBoolean = () => Math.round(Math.random()) === 0;
