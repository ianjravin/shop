import axios from 'axios';
import { apiBaseUrl } from '../config'

let base = apiBaseUrl;

export const requestLogin = params => {
    return axios.post(`${base}/login`, params).then(res => res.data);
};

export const getUserList = params => {
    return axios.get(`${base}/user/list`, {params: params});
};

export const getUserListPage = params => {
    return axios.get(`${base}/user/listpage`, {params: params});
};

export const removeUser = params => {
    return axios.get(`${base}/user/remove`, {params: params});
};

export const batchRemoveUser = params => {
    return axios.get(`${base}/user/batchremove`, {params: params});
};

export const editUser = params => {
    return axios.get(`${base}/user/edit`, {params: params});
};

export const addUser = params => {
    return axios.get(`${base}/user/add`, params);
};

//Dashboard Report
export const getDashboardReport = params => {
    return axios.get(`${base}/dashboard`, params);
}
/**
 *Categories
 **/
export const addCategory = params => {
    return axios.post(`${base}/categories`, params);
}
export const editCategory = params => {
    return axios.put(`${base}/categories/${params.id}`, params);
}
export const deleteCategory = params => {
    return axios.delete(`${base}/categories/${params.id}`);
}
export const getCategories = params => {
    return axios.get(`${base}/categories`, params);
}
export const getCategory = params => {
    return axios.get(`${base}/categories/${params.id}`);
}
/**
 *Products
 **/
export const addProduct = params => {
    return axios.post(`${base}/products`, params);
}
export const editProduct = params => {
    return axios.put(`${base}/products/${params.id}`, params);
}
export const deleteProduct = params => {
    return axios.delete(`${base}/products/${params.id}`);
}
export const getProducts = params => {
    return axios.get(`${base}/products`, params);
}
export const getProduct = params => {
    return axios.get(`${base}/products/${params.id}`);
}
/**
 * Product options
 */
export const addProductOption = params => {
    return axios.post(`${base}/products/options`, params);
}
export const editProductOption = params => {
    return axios.put(`${base}/products/options/${params.id}`, params);
}
export const deleteProductOption  = params => {
    return axios.delete(`${base}/products/options/${params.id}`);
}
export const getProductOptions  = params => {
    return axios.get(`${base}/products/${params.id}/options`, params);
}
export const getProductOption = params => {
    return axios.get(`${base}/products/options/${params.id}`);
}

/**
 * Product attributes
 */
export const addProductAttribute = params => {
    return axios.post(`${base}/products/attributes`, params);
}
export const editProductAttribute = params => {
    return axios.put(`${base}/products/attributes/${params.id}`, params);
}
export const deleteProductAttribute  = params => {
    return axios.delete(`${base}/products/attributes/${params.id}`);
}
export const getProductAttributes  = params => {
    return axios.get(`${base}/products/${params.id}/attributes`, params);
}
export const getProductAttribute = params => {
    return axios.get(`${base}/products/attributes/${params.id}`);
}
/**
 *Manufacturers
 **/
export const addManufacturer = params => {
    return axios.post(`${base}/manufacturers`, params);
}
export const editManufacturer = params => {
    return axios.put(`${base}/manufacturers/${params.id}`, params);
}
export const deleteManufacturer = params => {
    return axios.delete(`${base}/manufacturers/${params.id}`);
}
export const getManufacturers = params => {
    return axios.get(`${base}/manufacturers`, params);
}
export const getManufacturer = params => {
    return axios.get(`${base}/manufacturers/${params.id}`);
}

/**
 *Orders
 **/
export const addOrder = params => {
    return axios.post(`${base}/orders`, params);
}

export const editOrder = params => {
    return axios.put(`${base}/orders/${params.id}`, params);
}
export const deleteOrder = params => {
    return axios.delete(`${base}/orders/${params.id}`);
}
export const getOrders = params => {
    return axios.get(`${base}/orders`, params);
}
export const getOrder = params => {
    return axios.get(`${base}/orders/${params.id}`);
}

/**
 * Options
 * @param params
 * @returns {AxiosPromise}
 */
export const addOption = params => {
    return axios.post(`${base}/options`, params);
}
export const editOption = params => {
    return axios.put(`${base}/options/${params.id}`, params);
}
export const deleteOption = params => {
    return axios.delete(`${base}/options/${params.id}`);
}
export const getOptions = params => {
    return axios.get(`${base}/options`, {params: params});
}
export const getOption = params => {
    return axios.get(`${base}/options/${params.id}`);
}
/**
 *Attribute Groups
 **/
export const addAttribute = params => {
    return axios.post(`${base}/attributes`, params);
}
export const editAttribute = params => {
    return axios.put(`${base}/attributes/${params.id}`, params);
}
export const deleteAttribute = params => {
    return axios.delete(`${base}/attributes/${params.id}`);
}
export const getAttributes = params => {
    return axios.get(`${base}/attributes`, {params: params});
}
export const getAttribute = params => {
    return axios.get(`${base}/attributes/${params.id}`);
}

/**
 *Attribute Groups
 **/
export const addAttributeGroup = params => {
 return axios.post(`${base}/attributes/groups`, params);
 }
 export const editAttributeGroup = params => {
 return axios.put(`${base}/attributes/groups/${params.id}`,  params);
 }
 export const deleteAttributeGroup = params => {
 return axios.delete(`${base}/attributes/groups/${params.id}`);
 }
export const getAttributeGroups = params => {
    return axios.get(`${base}/attributes/groups`, {params: params});
}
 export const getAttributeGroup = params => {
 return axios.get(`${base}/attributes/groups/${params.id}`);
 }
/**
 *Banners
 **/
export const addBanner= params => {
    return axios.post(`${base}/banners`, params);
}
export const editBanner = params => {
    return axios.put(`${base}/banners/${params.id}`,  params);
}
export const deleteBanner = params => {
    return axios.delete(`${base}/banners/${params.id}`);
}
export const getBanners = params => {
    return axios.get(`${base}/banners`, {params: params});
}
export const getBanner = params => {
    return axios.get(`${base}/banners/${params.id}`);
}
/*
 *Orders Products
 **/
export const addOrderProducts = params => {
    return axios.post(`${base}/orders/products`, params);
}
export const editOrderProducts = params => {
    return axios.put(`${base}/orders/${params.id}/products`, params);
}
export const deleteOrderProducts = params => {
    return axios.delete(`${base}/orders/${params.id}/products`);
}
export const getOrdersProducts = params => {
    return axios.get(`${base}/orders/${params.id}/products`, {});
}
export const getOrderProducts = params => {
    return axios.get(`${base}/orders/${params.id}/products/${params.id}`);
}


export const uploadFile = params => {
    let config={headers: { 'content-type': 'multipart/form-data' }}
    return axios({method: params.method, url: `${params.url}`, data: params.data, headers : { 'content-type': 'multipart/form-data' }});
}