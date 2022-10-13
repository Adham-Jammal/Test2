import http from '../httpService';
import { FeesPercentageDto } from './dto';

class ConfigurationsService {
  public async getFeesPercentage(): Promise<FeesPercentageDto> {
    let result = await http.get('api/services/app/Configuration/GetFeesPercentage');
    return result.data.result;
  }

  public async updateFeesPercentage(input: FeesPercentageDto): Promise<any> {
    let result = await http.put('api/services/app/Configuration/UpdateFeesPercentage', input);
    return result.data;
  }
}

export default new ConfigurationsService();
