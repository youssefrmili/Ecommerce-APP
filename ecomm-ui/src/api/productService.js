import BaseService from "./baseApiService";

export const Response = (res) => {
  return { data: res.data, status: res.status };
};

export const errorResponse = (error) => {
  return { message: error.data.description, status: error.status };
};

class ProductService extends BaseService {
  static async addProduct(product) {
    return BaseService.post(product, "/admin/product");
  }

  static async addProductToCart(productVariant) {
    return BaseService.post(productVariant, "/cart");
  }

  static async getProductDetailsWithVariants(productId) {
    return BaseService.get(null, "/product/".concat(productId));
  }

  static async fetchAllProducts(categoryId) {
    return BaseService.post(
      {
        searchTerm: "",
        pagination: {
          pageNo: 0,
          pageSize: 30,
        },
        filters: [
          {
            field: "category.id",
            values: [categoryId],
          },
        ],
        sorts: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
      "/product/search"
    );
  }
}

export default ProductService;
