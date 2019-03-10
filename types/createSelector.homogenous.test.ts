import { createSelector } from "redux-views";
import { getSelectedContactId, getContactId } from "./test.types";
import { selectedContactIdSelector, contactIdSelector } from "./createKeySelector.test";

const areEqual = <T>(a: T, b: T) => a === b;

// $ExpectType OutputSelector<State, boolean>
createSelector(
  getSelectedContactId,
  getSelectedContactId,
  areEqual
);

// $ExpectType OutputParametricSelector<State, PropsA, boolean>
createSelector(
  getSelectedContactId,
  getContactId,
  areEqual
);

// $ExpectType OutputInstanceSelector<State, boolean>
createSelector(
  getSelectedContactId,
  selectedContactIdSelector,
  areEqual
);

// $ExpectType OutputInstanceSelector<State, boolean>
createSelector(
  selectedContactIdSelector,
  getSelectedContactId,
  areEqual
);

// Fails for TS3.1 or less, because contactIdSelector takes `unknown` and heterogenous types are too far behind.
// $ExpectType OutputParametricInstanceSelector<State, PropsA, boolean>
createSelector(
  getSelectedContactId,
  contactIdSelector,
  areEqual
);

// $ExpectType OutputParametricInstanceSelector<State, PropsA, boolean>
createSelector(
  selectedContactIdSelector,
  getContactId,
  areEqual
);
