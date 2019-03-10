export interface Contact {
  name: string;
}

export interface Company {
  employees: Array<string>;
}

export interface State {
  contacts: {
    [key: string]: Contact
  };
  companies: {
    [key: string]: Company
  };
  selectedContact: string;
}

export interface PropsA {
  contactId: string;
}

export const getContactId = (_: unknown, { contactId }: PropsA) => contactId;
export const getSelectedContactId = ({ selectedContact }: State) => selectedContact;
export const getContacts = ({ contacts }: State) => contacts;
