import {
  AlwaysSmallerAndNonNegative,
  NonNegativeInteger,
} from "@/src/types/helpers";

export const rangeNonNegative = <T extends number, U extends number>(
  from: AlwaysSmallerAndNonNegative<T, NonNegativeInteger<U>>,
  to: U
): number[] => {
  return Array.from({ length: to - from + 1 }).map((_, i) => i + from);
};
