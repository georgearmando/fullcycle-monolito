import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import { ProductModel } from "../repository/product.model";
import { InvoiceFacadeFactory } from "../factory/invoice.facade.factory";

describe("Invoice Facade test", () => {
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
    const facade = InvoiceFacadeFactory.create();
    
    const product = {
      id: "Product Id",
      name: "Product 1",
      price: 100,
    }

    const input = {
      id: "1",
      name: "Invoice 1",
      document: "Invoice Doc",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
      items: [product],
    }

    await facade.generate(input);

    const invoice = await InvoiceModel.findOne({ 
      where: { id: "1" }, 
      include: [ProductModel], 
    });

    console.log(invoice)

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(input.id);
    expect(invoice.name).toBe(input.name);
    expect(invoice.items.length).toBe(1);
  })

  it("should find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    
    const product = {
      id: "Product Id",
      name: "Product 1",
      price: 100,
    }

    const input = {
      id: "1",
      name: "Invoice 1",
      document: "Invoice Doc",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
      items: [product],
    }

    await facade.generate(input);

    const invoice = await facade.find({ id: "1"});

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(input.id);
    expect(invoice.name).toBe(input.name);
    expect(invoice.items.length).toBe(1);
  })
})