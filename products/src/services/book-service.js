const { ProductRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");
const redisClient = require("../utils/redis-client");

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
      // Check if products data is in the cache
      const cachedProducts = await redisClient.get("products");

      if (cachedProducts) {
        console.log("Products data retrieved from cache");
        return FormateData(JSON.parse(cachedProducts));
      }

      // If not in cache, fetch from database
      const books = await this.repository.books();

      let categories = {};

      books.map(({ type }) => {
        categories[type] = type;
      });

      const productData = {
        books,
        categories: Object.keys(categories),
      };

      // Store the product data in the cache with an expiration time of 1 hour
      await redisClient.setEx("products", 3600, JSON.stringify(productData));

      console.log("Products data retrieved from database");
      return FormateData(productData);
    } catch (err) {
      throw new APIError("Data Not found", err);
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
