/**
 * Open-closed interval ]a,b] due to Budan's theorem's statements
 */
import { Interval } from "./types";
export declare function createInterval(leftBound: number, rightBound: number): Interval;
export declare function getLeftBound(interval: Interval): number;
export declare function getRightBound(interval: Interval): number;
export declare function getLength(interval: Interval): number;
export declare function containsValue(interval: Interval, value: number): boolean;
/**
 * Checks if the interval contains an odd number of roots of the given continuous function.
 * @param func The function to check for roots.
 * @returns True if the interval contains an odd number of roots, otherwise false.
 */
export declare function containsSingleRoot(interval: Interval, func: (value: number) => number): boolean;
