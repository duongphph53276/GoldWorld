export interface IOrder {
    id: number;
    image: string;
    name: string;
    quantity: number;
    price: number;
    sum: number;
  }

export type IOrderForm = Omit<IOrder, "id">;
