
export interface PromotersPagedFilterRequest {
  maxResultCount: number;
  skipCount: number;  
  keyword?:string;
  isActive?:boolean;
  vehicleType?:number;
}
