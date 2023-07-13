import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { Product } from "../domain/entity/product";
import { Invoice } from "../domain/entity/invoice";
import Id from "../../@shared/domain/value-object/id.value-object";
import { Address } from "../domain/value-objects/address";
import { InvoiceRepository } from "./invoice.repository";
import { ProductModel } from "./product.model";

describe("Invoice Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a invoice", async () => {
    const product = new Product({
      name: "Product 1",
      price: 100,
    });
    
    const product2 = new Product({
      name: "Product 2",
      price: 200,
    });
    
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice Name",
      document: "Invoice Doc",
      address: new Address({
        street: "Street 1",
        number: "Number 1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zip Code 1",
      }),
      items: [product, product2],
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);
    
    const invoiceDB = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [ProductModel], 
    });

    expect(invoiceDB).toBeDefined();
    expect(invoiceDB.id).toBe(invoice.id.id);
    expect(invoiceDB.name).toBe(invoice.name);
    expect(invoiceDB.city).toBe(invoice.address.city);
    expect(invoiceDB.items.length).toBe(2);
    expect(invoiceDB.createdAt).toStrictEqual(invoice.createdAt);
    expect(invoiceDB.updatedAt).toStrictEqual(invoice.updatedAt);
  });

  it("should find a invoice", async () => {  
    const product1 = new Product({
      name: "Product 1",
      price: 200,
    });

    await InvoiceModel.create({
      id: "1",
      name: "Invoice Name",
      document: "Invoice Doc",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
      items: [{
        id: product1.id.id,
        name: product1.name,
        price: product1.price,
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      include: [{ model: ProductModel }]
    });

    const repository = new InvoiceRepository();
    const invoice = await repository.find("1");

    expect(invoice.id.id).toBe("1");
    expect(invoice.name).toBe("Invoice Name");
    expect(invoice.document).toBe("Invoice Doc");
    expect(invoice.items.length).toBe(1)
    expect(invoice.total()).toBe(200);
  });
})