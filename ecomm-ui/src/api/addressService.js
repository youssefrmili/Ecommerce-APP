import BaseService from "./baseApiService";

export const Response = (res) => {
  return { data: res.data, status: res.status };
};

export const errorResponse = (error) => {
  return { message: error.data.description, status: error.status };
};

class AddressService extends BaseService {
  static async getAllAdresses() {
    return BaseService.get(null, "/address");
  }

  static async createAddress(address) {
    return BaseService.post(address, "/address");
  }
}

export default AddressService;
