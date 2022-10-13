import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { ProductsPagedFilterRequest, ProductDto, CreateProductDto, UpdateProductDto } from './dto';
import { LiteEntityDto } from '../locations/dto/liteEntityDto';

class ProductsService {
  public async getAll(input: ProductsPagedFilterRequest): Promise<PagedResultDto<ProductDto>> {
    const {
      isActive,
      skipCount,
      maxResultCount,
      shopId,
      categoryId,
      classificationId,
      keyword,
      OnlyFeatured,
      HasOffer,
      Sorting,
      myProducts,
    } = input;
    const result = await http.get('api/services/app/Product/GetAll', {
      params: {
        isActive,
        skipCount,
        maxResultCount,
        shopId,
        categoryId,
        classificationId,
        keyword,
        OnlyFeatured,
        HasOffer,
        Sorting,
        myProducts,
      },
    });
    return result.data.result;
  }

  public async getAllLite(
    input: ProductsPagedFilterRequest
  ): Promise<PagedResultDto<LiteEntityDto>> {
    const result = await http.get('api/services/app/Product/GetAllLite', {
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    });
    return result.data.result;
  }

  public async getProduct(input: EntityDto): Promise<ProductDto> {
    const result = await http.get('api/services/app/Product/Get', { params: { id: input.id } });
    return result.data.result;
  }

  public async createProduct(input: CreateProductDto): Promise<ProductDto> {
    const result = await http.post('api/services/app/Product/Create', input);
    return result.data;
  }

  public async updateProduct(input: UpdateProductDto): Promise<ProductDto> {
    const result = await http.put('api/services/app/Product/Update', input);
    return result.data;
  }

  public async productActivation(input: EntityDto) {
    const result = await http.put('api/services/app/Product/Activate', input);
    return result.data;
  }

  public async productDeactivation(input: EntityDto) {
    const result = await http.put('api/services/app/Product/DeActivate', input);
    return result.data;
  }

  public async productFeature(input: EntityDto) {
    const result = await http.post('api/services/app/Product/Feature', input);
    return result.data;
  }

  public async productUnFeature(input: EntityDto) {
    const result = await http.post('api/services/app/Product/UnFeature', input);
    return result.data;
  }

  public async productAddToFavorite(input: EntityDto) {
    const result = await http.post('api/services/app/Product/AddToFavorite', input);
    return result.data;
  }

  public async productRemoveFromFavorite(input: EntityDto) {
    const result = await http.delete('api/services/app/Product/RemoveFromFavorite', {
      params: { id: input?.id },
    });
    return result.data;
  }
}

export default new ProductsService();
