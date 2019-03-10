import { createKeyedSelectorFactory, createKeySelector, createSelector } from 'redux-views';

interface Contact {
  name: string;
}

interface Company {
  employees: Array<string>;
}

interface State {
  contacts: {
    [key: string]: Contact
  };
  companies: {
    [key: string]: Company
  };
  selectedContact: string;
}

interface PropsA {
  contactId: string;
}

const getContactId = (_: unknown, { contactId }: PropsA) => contactId;
const getSelectedContactId = ({ selectedContact }: State) => selectedContact;
const getContacts = ({ contacts }: State) => contacts;

// $ExpectType InstanceSelector<State, string>
const selectedContactIdSelector = createKeySelector(getSelectedContactId);

// $ExpectType ParametricInstanceSelector<unknown, PropsA, string>
const contactIdSelector = createKeySelector(getContactId);

// $ExpectType KeyedSelectorFactory<State, Contact>
const contactSelectorFactory = createKeyedSelectorFactory(
  getContacts,
  (contacts, key) => contacts[key]
);

// $ExpectType InstanceSelector<State, Contact>
const getSelectedContact = contactSelectorFactory(getSelectedContactId);

// $ExpectType ParametricInstanceSelector<State, PropsA, Contact>
const getContactById = contactSelectorFactory(getContactId);

/// createSelector - homogenous
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
