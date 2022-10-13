import { ProductDto } from "../../products/dto";
import { OrderDto } from "./orderDto";

export interface OrderItemDto {
    id:number;
    orderId:number;
    order:OrderDto;
    productId:number;
    product:ProductDto;
    quantity:number;
    price:number;
}
      