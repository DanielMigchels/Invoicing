export interface CreateCompanyRequestModel {
  name: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  email: string;
  phoneNumber: string;
  bankAccountNumber: string;
  chamberOfCommerceNumber: string | null;
  vatNumber: string | null;
}
