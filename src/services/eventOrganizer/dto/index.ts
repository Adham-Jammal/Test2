export interface EventOrganizerPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  isActive?: boolean;
  keyword?: string;
}
export interface CreateOrUpdateEventOrganizerDto {
  firstName: string;
  lastname: string;
  birthDate?: Date;
  userName: string;
  phoneNumber: string;
  countryCode: string;
  emailAddress: string;
  id?: number;
  licenseUrl?: string;
  bankId: number;
  accountNumber: string;
  companyWebsite: string;
  imageUrl: string;
  password?: string;
}
export interface CreateEventOrganizerDto {
  firstName: string;
  lastname: string;
  birthDate?: Date;
  userName: string;
  phoneNumber: string;
  countryCode: string;
  emailAddress: string;
  password: string;
  bankId: string;
  accountNumber: string;
  companyWebsite: string;
  imageUrl: string;
}
export interface EventOrganizerDto {
  name?: string;
  surname?: string;
  phoneNumber?: string;
  countryCode?: string;
  emailAddress?: string;
  isActive: boolean;
  userName?: string;
  registrationDate?: string;
  id?: number;
  licenseUrl?: string;
  bankId?: number;
  bankName?: number;
  accountNumber?: string;
  companyWebsite?: string;
  imageUrl?: string;
  isLive: boolean;
}
