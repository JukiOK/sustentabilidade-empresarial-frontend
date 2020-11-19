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

export const updateOrganization = async (id, body) => {
  return axiosApi.put('/organization/' + id, body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const createUser = async (body) => {
  return axiosApi.post('/user', body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getOrganization = async (orgId) => {
  return axiosApi.get('/organization/' + orgId)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getMe = async () => {
  return axiosApi.get('/user/me')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}
