export interface GetAllPermissionsOutput {
  name: string;
  displayName: string;
  key:string;
  description: string;
  id: number;
  children:Array<GetAllPermissionsOutput>
}
