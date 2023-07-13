import Id from "../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../domain/entity/invoice";
import { Product } from "../domain/entity/product";
import { Address } from "../domain/value-objects/address";
import { InvoiceGateway } from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import { ProductModel } from "./product.model";

export class InvoiceRepository implements InvoiceGateway {
  async generate(input: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: input.id.id,
      name: input.name,
      document: input.document,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipCode: input.address.zipCode,
      items: input.items.map(item => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
        }
      }),
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    },
    {
      include: [{ model: ProductModel }]
    })
  }
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [ProductModel]
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      }),
      items: invoice.items.map(item => {
        return new Product({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        })
      }),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    })
  }
}