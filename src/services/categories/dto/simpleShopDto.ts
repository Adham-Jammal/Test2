export interface SimpleShopDto {
  id: number;
  logoUrl: string;
  coverUrl: string;
  name: string;
  description: string;
  followersCount?: number;
  isFollowed?: boolean;
}
