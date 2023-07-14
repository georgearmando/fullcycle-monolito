import { Order } from "../domain/order.entity";

export interface CheckoutGateway {
  add(order: Order): Promise<void>;
  find(id: string): Promise<Order | null>;
}