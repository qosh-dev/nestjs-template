export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;

/**
 * A type that recursively expands an object type and its nested properties.
 * @template T - The type of the object to expand deeply.
 */
export type ExpandDeep<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandDeep<O[K]> }
    : never
  : T;

type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type ExcludeObjectArrays<T> = Expand<{
  [K in keyof T as Exclude<T[K], object | Array<any>> extends never
    ? never
    : K]: T[K];
}>;

type Primitives = string | number | boolean | Date | never | null | undefined;
// ------------------------------------------------

export type Select<T> = Partial<{
  [K in keyof T]: T[K] extends string | number | boolean | Date
    ? boolean
    : T[K] extends Array<infer U>
    ? Select<U> | boolean
    : Select<T[K]> | boolean;
}>;

// ---------------------------------------------------------------

type StringValues<T> = {
  [K in keyof T]: T[K] extends string | number ? T[K] : never;
}[keyof T];

export type EnumAsUnion<T> = `${StringValues<T>}`;

// ---------------------------------------------------------------
