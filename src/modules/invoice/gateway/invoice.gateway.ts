import { Invoice } from "../domain/entity/invoice";

export interface InvoiceGateway {
  generate(input: Invoice): Promise<void>;
  find(id: string): Promise<Invoice>;
}