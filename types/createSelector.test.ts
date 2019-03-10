import { createSelector, OutputParametricSelector, OutputParametricInstanceSelector } from "redux-views";
import { getSelectedContactId, getContactId, getContacts, getCompanies, getCompanyId, State, PropsA, PropsB } from "./test.types";
import { selectedContactIdSelector, contactIdSelector } from "./createKeySelector.test";
import { getContactById } from "createKeySelectorFactory.test";

const areEqual = <T>(a: T, b: T) => a === b;

//////////////////////////////
/// Homogenous state/props ///
//////////////////////////////

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

////////////////////////////////
/// Heterogenous state/props ///
////////////////////////////////

// Non-instance selectors
const getContact = createSelector(
  getContacts,
  getContactId,
  (contacts, contactId) => contacts[contactId]
);
const getCompany = createSelector(
  getCompanies,
  getCompanyId,
  (company, companyId) => company[companyId]
);

const companyHasContact = createSelector(
  getContact,
  getCompany,
  (contact, company) => company.employees.indexOf(contact.name) >= 0
);
// $ExpectType true
type CHC_IS_RIGHT = typeof companyHasContact extends OutputParametricSelector<State, PropsA & PropsB, boolean> ? true : false;

const inst_companyHasContact = createSelector(
  getContactById,
  getCompany,
  (contact, company) => company.employees.indexOf(contact.name) >= 0
);
// $ExpectType true
type ICHC_IS_RIGHT = typeof inst_companyHasContact extends OutputParametricInstanceSelector<State, PropsA & PropsB, boolean> ? true : false;
