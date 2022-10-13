
export interface CreateAdminDto {
    name: string;
    surname: string;
    emailAddress: string;
    // isActive?: boolean;
    permissionKeys?: Array<string>;
    password: string;
}
