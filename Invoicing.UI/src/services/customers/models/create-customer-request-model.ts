export interface CreateCustomerRequestModel {
  name: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  contactPerson: string | null;
  email: string | null;
  phoneNumber: string | null;
  vatNumber: string | null;
}
