export type NonNegativeInteger<T extends number> = number extends T
  ? never
  : `${T}` extends `-${string}` | `${string}.${string}`
  ? never
  : T;

type AlwaysSmaller<
  A extends number,
  B extends number,
  R extends any[] = []
> = R["length"] extends B
  ? never
  : R["length"] extends A
  ? A
  : AlwaysSmaller<A, B, [any, ...R]>;

type AlwaysSmallerAndNonNegative<
  T extends number,
  U extends number
> = NonNegativeInteger<T> extends never
  ? never
  : NonNegativeInteger<U> extends never
  ? never
  : AlwaysSmaller<T, U>;

export type Repeat<
  T,
  N extends number,
  U extends T[] = []
> = N extends NonNegativeInteger<N>
  ? N extends U["length"]
    ? U
    : Repeat<T, N, [...U, T]>
  : never;

export type RangeInteger<
  Start extends number,
  End extends number,
  A extends void[] = Repeat<void, Start>
> = Start extends NonNegativeInteger<Start>
  ? End extends NonNegativeInteger<End>
    ? End extends A["length"]
      ? End
      : A["length"] | RangeInteger<Start, End, [...A, void]>
    : never
  : never;
