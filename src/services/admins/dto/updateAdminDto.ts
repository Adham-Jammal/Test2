
export interface UpdateAdminDto {
    id: number;
    name: string;
    surname: string;
    emailAddress: string;
    // isActive?: boolean;
    permissionKeys?: Array<string>;
}
