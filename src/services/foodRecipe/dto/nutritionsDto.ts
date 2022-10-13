import { SubNutritionsDto } from './subNutritionsDto';

export interface NutritionsDto {
  name: string;
  totalWeight: number;
  subNutritions: SubNutritionsDto[];
}
