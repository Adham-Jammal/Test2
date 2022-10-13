export interface AuthenticationResultModel {
  accessToken: string;
  encryptedAccessToken: string;
  expireInSeconds: number;
  userId: number;
  userType: number;
  name: string;
  shopId?: number;
  status?: number;
  imageUrl?: string | null;
}
