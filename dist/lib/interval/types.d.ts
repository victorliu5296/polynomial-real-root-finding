/**
 * The Interval type is an open interval (a,b) unless it has length 0, in which case it is closed [r, r].
 * This is to avoid duplicate intervals while allowing for the possibility of 0 length intervals that span the root.
 */
export type Interval = [number, number];
