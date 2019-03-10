import { createSelector } from "redux-views";
import { getSelectedContactId, getContactId } from "./test.types";
import { selectedContactIdSelector, contactIdSelector } from "./createKeySelector.test";

const areEqual = <T>(a: T, b: T) => a === b;

// $ExpectType OutputSelector<{ selectedContact: string; }, boolean>
createSelector(
  getSelectedContactId,
  getSelectedContactId,
  areEqual
);

// $ExpectType OutputParametricSelector<{ selectedContact: string; }, PropsA, boolean>
createSelector(
  getSelectedContactId,
  getContactId,
  areEqual
);

// $ExpectType OutputInstanceSelector<{ selectedContact: string; }, boolean>
createSelector(
  getSelectedContactId,
  selectedContactIdSelector,
  areEqual
);

// $ExpectType OutputInstanceSelector<{ selectedContact: string; }, boolean>
createSelector(
  selectedContactIdSelector,
  getSelectedContactId,
  areEqual
);

// Fails for TS3.1 or less, because contactIdSelector takes `unknown` and heterogenous types are too far behind.
// $ExpectType OutputParametricInstanceSelector<{ selectedContact: string; }, PropsA, boolean>
createSelector(
  getSelectedContactId,
  contactIdSelector,
  areEqual
);

// $ExpectType OutputParametricInstanceSelector<{ selectedContact: string; }, PropsA, boolean>
createSelector(
  selectedContactIdSelector,
  getContactId,
  areEqual
);
