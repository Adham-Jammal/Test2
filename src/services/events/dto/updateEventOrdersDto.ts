
export interface UpdateEventOrdersDto {
    orders:Array<EventOrderDto>;
}

      
export class EventOrderDto<T = number> {
    id: T;
    order:T;
  
    constructor(_id: T,_order:T){
      this.id = _id;
      this.order = _order;
    }

  }
  