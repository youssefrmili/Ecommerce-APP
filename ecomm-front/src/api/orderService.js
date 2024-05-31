import BaseService from "./baseApiService";

export const Response = (res) => {
  return { data: res.data, status: res.status };
};

export const errorResponse = (error) => {
  return { message: error.data.description, status: error.status };
};

class OrderService extends BaseService {
  static async getOrderSummaryForActiveCart() {
    return BaseService.get(null, "/order/summary");
  }

  static async placeOrder() {
    return BaseService.post(null, "/order");
  }
}

export default OrderService;
