export interface LoginResponseModel {
  jwt: string;
  success: boolean;
  isLockedOut: boolean;
}
