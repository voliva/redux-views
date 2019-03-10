import { createKeyedSelectorFactory } from "redux-views";
import { getContacts, getSelectedContactId, getContactId } from "./test.types";

// $ExpectType KeyedSelectorFactory<State, Contact>
const contactSelectorFactory = createKeyedSelectorFactory(
  getContacts,
  (contacts, key) => contacts[key]
);

// $ExpectType InstanceSelector<State, Contact>
export const getSelectedContact = contactSelectorFactory(getSelectedContactId);

// $ExpectType ParametricInstanceSelector<State, PropsA, Contact>
export const getContactById = contactSelectorFactory(getContactId);
