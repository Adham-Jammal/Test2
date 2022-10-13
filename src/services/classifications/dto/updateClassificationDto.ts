
export interface UpdateClassificationDto {
    id:number;
    arName: string;
    enName: string;
    isActive:boolean;
    imageUrl?: string;
    categoryId:number;
    properties?:string;
}
      