import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';
import { EntityDto } from '../dto/entityDto';
import { OfferDto } from './dto/OfferDto';
import { CreateOfferDto } from './dto/createOfferDto';
import { UpdateOfferDto } from './dto/updateOfferDto';

class OffersService {
  public async getAll(input: PagedFilterAndSortedRequest): Promise<PagedResultDto<OfferDto>> {
    let result = await http.get('api/services/app/Offer/GetAll', {
      params: {
        type: input.type,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        keyword: input.keyword,
      },
    });
    return result.data.result;
  }

  public async getOffer(input: EntityDto): Promise<OfferDto> {
    let result = await http.get('api/services/app/Offer/Get', { params: { id: input.id } });
    return result.data;
  }

  public async createOffer(input: CreateOfferDto): Promise<OfferDto> {
    let result = await http.post('api/services/app/Offer/Create', input);
    return result.data;
  }

  public async updateOffer(input: UpdateOfferDto): Promise<OfferDto> {
    let result = await http.put('api/services/app/Offer/Update', input);
    return result.data;
  }

  public async offerActivation(input: EntityDto) {
    let result = await http.put('api/services/app/Offer/Activate', input);
    return result.data;
  }

  public async offerDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/Offer/DeActivate', input);
    return result.data;
  }

  public async deleteOffer(input: EntityDto) {
    let result = await http.delete('api/services/app/Offer/Delete', { params: { id: input.id } });
    return result.data;
  }
}

export default new OffersService();
