import axios from 'axios';
import firebase from 'firebase';

const url = 'http://localhost:3000';

export const axiosApi = axios.create({
  baseURL: url,
  timeout: 20000,
	headers: {
	  'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
	}
})

axiosApi.interceptors.request.use(async (options) => {
	options.headers["Authorization"] = await firebase.auth().currentUser.getIdToken();
	return options;
});

export const createUser = async (body) => {
  axiosApi.post('/user', body)
  .then( response => response.data)
  .catch();
}
