import Id from "../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../domain/entity/invoice";
import { Product } from "../../domain/entity/product";
import { Address } from "../../domain/value-objects/address";
import { FindInvoiceUseCase } from "./find-invoice.usecase";

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
})

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find invoice usecase unit test", () => {
  it("should find a invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);

    const input = {
      id: "1"
    }

    const result = await usecase.execute(input);

    expect(result).toBeDefined();
    expect(result.id).toBe("1")
    expect(result.name).toBe(invoice.name);
    expect(result.total).toBe(300);
    expect(result.items.length).toBe(2);
  })
})