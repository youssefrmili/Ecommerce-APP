import BaseService from "./baseApiService";

export const Response = (res) => {
  return { data: res.data, status: res.status };
};

export const errorResponse = (error) => {
  return { message: error.data.description, status: error.status };
};

class CategoryService extends BaseService {
  static async getAllCategories() {
    return BaseService.get(null, "/category");
  }

  static async getFeatureNames(category) {
    return BaseService.get(null, "/admin/feature-template/".concat(category));
  }

  static async getVariantFeatures(category) {
    return BaseService.get(null, "/admin/variant/".concat(category));
  }
}

export default CategoryService;
