import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { SliderImagePagedFilterRequest } from './dto/sliderImagePagedFilterRequest';
import { SliderImageDto } from './dto/sliderImageDto';
import { CreateSliderImageDto } from './dto/createSliderImageDto';
import { UpdateSliderImageDto } from './dto/updateSliderImageDto';

class SliderImagesService {
  public async getAll(
    input: SliderImagePagedFilterRequest
  ): Promise<PagedResultDto<SliderImageDto>> {
    let result = await http.get('api/services/app/SliderImage/GetAll', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        isActive: input.isActive,
        keyword: input.keyword,
        shopId: input.shopId,
        myPromotions: input.myPromotions,
      },
    });
    return result.data.result;
  }

  public async getSliderImage(input: EntityDto): Promise<SliderImageDto> {
    let result = await http.get('api/services/app/SliderImage/Get', { params: { id: input.id } });
    return result.data;
  }

  public async createSliderImage(input: CreateSliderImageDto): Promise<SliderImageDto> {
    let result = await http.post('api/services/app/SliderImage/Create', input);
    return result.data;
  }

  public async updateSliderImage(input: UpdateSliderImageDto): Promise<SliderImageDto> {
    let result = await http.put('api/services/app/SliderImage/Update', input);
    return result.data;
  }

  public async sliderImageActivation(input: EntityDto) {
    let result = await http.put('api/services/app/SliderImage/Activate', input);
    return result.data;
  }

  public async sliderImageDeActivation(input: EntityDto) {
    let result = await http.put('api/services/app/SliderImage/DeActivate', input);
    return result.data;
  }

  public async deleteSliderImage(input: EntityDto) {
    let result = await http.delete('api/services/app/SliderImage/Delete', {
      params: { id: input.id },
    });
    return result.data;
  }
}

export default new SliderImagesService();
