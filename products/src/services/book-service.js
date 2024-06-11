const { ProductRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInputs) {
    try {
      const productResult = await this.repository.CreateProduct(productInputs);
      return FormateData(productResult);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProducts() {
    try {
      const books = await this.repository.books();

      let categories = {};

      books.map(({ type }) => {
        categories[type] = type;
      });

      return FormateData({
        books,
        categories: Object.keys(categories),
      });
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductDescription(productId) {
    try {
      const book = await this.repository.FindById(productId);
      return FormateData(book);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductsByCategory(category) {
    try {
      const books = await this.repository.FindByCategory(category);
      return FormateData(books);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetSelectedProducts(selectedIds) {
    try {
      const books = await this.repository.FindSelectedProducts(selectedIds);
      return FormateData(books);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductById(productId) {
    try {
      return await this.repository.FindById(productId);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductPayload(userId, { productId, qty }, event) {
    const book = await this.repository.FindById(productId);

    if (book) {
      const payload = {
        event: event,
        data: { userId, book, qty },
      };
      return FormateData(payload);
    } else {
      return FormateData({ message: "book Not Found" });
    }
  }
}

module.exports = ProductService;
