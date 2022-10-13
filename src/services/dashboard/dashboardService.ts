import http from '../httpService';
import { AdminStatistcsDto, OrganizerStatisticsDto, ShopStatisticsDto } from './dto/dashboardDto';

class DashboardService {
  public async getAdminStatistics(): Promise<AdminStatistcsDto> {
    let result = await http.get('api/services/app/Statistics/GetAdminStatistcsASync');
    return result.data.result;
  }

  public async getShopStatistics(): Promise<ShopStatisticsDto> {
    let result = await http.get('api/services/app/Statistics/GetShopStatistcsASync');
    return result.data.result;
  }

  public async getOrganizerStatistics(): Promise<OrganizerStatisticsDto> {
    let result = await http.get('api/services/app/Statistics/GetOrganizerStatistcsASync');
    return result.data.result;
  }
}

export default new DashboardService();
