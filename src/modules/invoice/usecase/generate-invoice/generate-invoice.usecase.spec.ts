import { GenerateInvoiceUseCase } from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe("Generate invoice usecase unit test", () => {
  it("should generate a invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

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

    const result = await usecase.execute(input);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.id).toBe(input.id);
    expect(result.name).toBe(input.name);
    expect(result.items[0].id).toBe('Product Id');
    expect(result.items.length).toBe(1)
  })
})