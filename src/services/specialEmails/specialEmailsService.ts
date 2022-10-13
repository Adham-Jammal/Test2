import http from '../httpService';
import { SpecialEmailDto } from './dto';

class SpecialEmailsService {
  // public async getFeesPercentage(): Promise<FeesPercentageDto> {
  //   let result = await http.get('api/services/app/Configuration/GetFeesPercentage');
  //   return result.data.result;
  // }

  public async SendSpecialEmail(input: SpecialEmailDto): Promise<any> {
    let result = await http.post('api/services/app/AccountEmail/SendSpecialEmail', input);
    return result.data;
  }
}

export default new SpecialEmailsService();
