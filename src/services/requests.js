import axios from 'axios';
import firebase from 'firebase';

const url = 'http://localhost:3000';

export const axiosApi = axios.create({
  baseURL: url,
  timeout: 20000,
	headers: {
	  'Content-Type': 'application/json',
	}
})

axiosApi.interceptors.request.use(async (options) => {
  options.headers["Authorization"] = await firebase.auth().currentUser.getIdToken();
  console.log(options);
  return options;
});

export const createOrganization = async (body) => {
  return axiosApi.post('/organization', body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const updateOrganization = async (body) => {
  return axiosApi.put('/organization/mine', body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const createUser = async (body) => {
  return axiosApi.post('/user', body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getOrganization = async (orgId) => {
  return axiosApi.get('/organization/mine')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getMe = async () => {
  return axiosApi.get('/user/me')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getCategories = async () => {
  return axiosApi.get('/common/categories')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getSectors = async () => {
  return axiosApi.get('/common/sectors')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getNumbEmp = async () => {
  return axiosApi.get('/common/sizes')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}
