export type KeySelector<S> = (state: S) => string;
export type Selector<S, R> = (state: S) => R;
export type OutputSelector<S, R> = Selector<S, R> & {
  recomputations: () => number;
}
export type InstanceSelector<S, R> = Selector<S, R> & {
  keySelector: KeySelector<S>
}
export type OutputInstanceSelector<S, R> = InstanceSelector<S, R> & {
  recomputations: () => number;
  use: () => [() => void, () => void],
  getCache: () => Map<string, any>
}

export type ParametricSelector<S, P, R> = (state: S, props: P, ...args: any[]) => R;
export type OutputParametricSelector<S, P, R> = ParametricSelector<S, P, R> & {
  recomputations: () => number;
}
export type ParametricKeySelector<S, P> = (state: S, props: P) => string;
export type ParametricInstanceSelector<S, P, R> = OutputSelector<S, P, R> & {
  keySelector: ParametricKeySelector<S, P>,
}

export type Instance<S> = S & {
  keySelector: KeySelector<S>;
}
export type Output<S> = S & {
  recomputations: () => number;
} & S extends Instance<any> ? {
  use: () => [() => void, () => void],
  getCache: () => Map<string, any>
} : {};

/* homogeneous selector parameter types */

/* one selector */
export function createSelector<S, R1, T>(
  selector: Selector<S, R1>,
  combiner: (res: R1) => T,
): OutputSelector<S, T>;
export function createSelector<S, P, R1, T>(
  selector: ParametricSelector<S, P, R1>,
  combiner: (res: R1) => T,
): OutputParametricSelector<S, P, T>;

/* two selectors */
export function createSelector<S, R1, R2, T>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  combiner: (res1: R1, res2: R2) => T,
): OutputSelector<S, T>;
export function createSelector<S, P, R1, R2, T>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  combiner: (res1: R1, res2: R2) => T,
): OutputParametricSelector<S, P, T>;

/* three selectors */
export function createSelector<S, R1, R2, R3, T>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  combiner: (res1: R1, res2: R2, res3: R3) => T,
): OutputSelector<S, T>;
export function createSelector<S, P, R1, R2, R3, T>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  selector3: ParametricSelector<S, P, R3>,
  combiner: (res1: R1, res2: R2, res3: R3) => T,
): OutputParametricSelector<S, P, T>;


/* array argument */

/* one selector */
export function createSelector<S, R1, T>(
  selectors: [Selector<S, R1>],
  combiner: (res: R1) => T,
): OutputSelector<S, T>;
export function createSelector<S, P, R1, T>(
  selectors: [ParametricSelector<S, P, R1>],
  combiner: (res: R1) => T,
): OutputParametricSelector<S, P, T>;

/* two selectors */
export function createSelector<S, R1, R2, T>(
  selectors: [Selector<S, R1>,
              Selector<S, R2>],
  combiner: (res1: R1, res2: R2) => T,
): OutputSelector<S, T>;
export function createSelector<S, P, R1, R2, T>(
  selectors: [ParametricSelector<S, P, R1>,
              ParametricSelector<S, P, R2>],
  combiner: (res1: R1, res2: R2) => T,
): OutputParametricSelector<S, P, T>;

/* three selectors */
export function createSelector<S, R1, R2, R3, T>(
  selectors: [Selector<S, R1>,
              Selector<S, R2>,
              Selector<S, R3>],
  combiner: (res1: R1, res2: R2, res3: R3) => T,
): OutputSelector<S, T>;
export function createSelector<S, P, R1, R2, R3, T>(
  selectors: [ParametricSelector<S, P, R1>,
              ParametricSelector<S, P, R2>,
              ParametricSelector<S, P, R3>],
  combiner: (res1: R1, res2: R2, res3: R3) => T,
): OutputParametricSelector<S, P, T>;

/* heterogeneous selector parameter types */

/* one selector */
export function createSelector<S1, R1, T>(
  selector1: Selector<S1, R1>,
  combiner: (res1: R1) => T,
): OutputSelector<S1, T>;
export function createSelector<S1, P1, R1, T>(
  selector1: ParametricSelector<S1, P1, R1>,
  combiner: (res1: R1) => T,
): OutputParametricSelector<S1, P1, T>;

/* two selector */
export function createSelector<S1, S2, R1, R2, T>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  combiner: (res1: R1, res2: R2) => T,
): OutputSelector<S1 & S2, T>;
export function createSelector<S1, S2, P1, P2, R1, R2, T>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  combiner: (res1: R1, res2: R2) => T,
): OutputParametricSelector<S1 & S2, P1 & P2, T>;

/* three selector */
export function createSelector<S1, S2, S3, R1, R2, R3, T>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  selector3: Selector<S3, R3>,
  combiner: (res1: R1, res2: R2, res3: R3) => T,
): OutputSelector<S1 & S2 & S3, T>;
export function createSelector<S1, S2, S3, P1, P2, P3, R1, R2, R3, T>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  selector3: ParametricSelector<S3, P3, R3>,
  combiner: (res1: R1, res2: R2, res3: R3) => T,
): OutputParametricSelector<S1 & S2 & S3, P1 & P2 & P3, T>;

/* array argument */

/* one selector */
export function createSelector<S1, R1, T>(
  selectors: [Selector<S1, R1>],
  combiner: (res1: R1) => T,
): OutputSelector<S1, T>;
export function createSelector<S1, P1, R1, T>(
  selectors: [ParametricSelector<S1, P1, R1>],
  combiner: (res1: R1) => T,
): OutputParametricSelector<S1, P1, T>;

/* two selector */
export function createSelector<S1, S2, R1, R2, T>(
  selectors: [Selector<S1, R1>, Selector<S2, R2>],
  combiner: (res1: R1, res2: R2) => T,
): OutputSelector<S1 & S2, T>;
export function createSelector<S1, S2, P1, P2, R1, R2, T>(
  selectors: [ParametricSelector<S1, P1, R1>, ParametricSelector<S2, P2, R2>],
  combiner: (res1: R1, res2: R2) => T,
): OutputParametricSelector<S1 & S2, P1 & P2, T>;

/* three selector */
export function createSelector<S1, S2, S3, R1, R2, R3, T>(
  selectors: [Selector<S1, R1>, Selector<S2, R2>, Selector<S3, R3>],
  combiner: (res1: R1, res2: R2, res3: R3) => T,
): OutputSelector<S1 & S2 & S3, T>;
export function createSelector<S1, S2, S3, P1, P2, P3, R1, R2, R3, T>(
  selectors: [ParametricSelector<S1, P1, R1>, ParametricSelector<S2, P2, R2>, ParametricSelector<S3, P3, R3>],
  combiner: (res1: R1, res2: R2, res3: R3) => T,
): OutputParametricSelector<S1 & S2 & S3, P1 & P2 & P3, T>;

/* any number of uniform selectors */
export function createSelector<S, R, T>(
  selectors: Selector<S, R>[],
  combiner: (...res: R[]) => T,
): OutputSelector<S, T>;
export function createSelector<S, P, R, T>(
  selectors: ParametricSelector<S, P, R>[],
  combiner: (...res: R[]) => T,
): OutputParametricSelector<S, P, T>;

export function createStructuredSelector<S, T>(
  selectors: {[K in keyof T]: Selector<S, T[K]>},
  selectorCreator?: typeof createSelector,
): Selector<S, T>;

export function createStructuredSelector<S, P, T>(
  selectors: {[K in keyof T]: ParametricSelector<S, P, T[K]>},
  selectorCreator?: typeof createSelector,
): ParametricSelector<S, P, T>;