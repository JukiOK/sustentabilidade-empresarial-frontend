import axios from 'axios';
import firebase from 'firebase';
import {firebaseCheckToken} from '../utils/firebaseUtils';

const url = 'http://localhost:3000';

//configuração do axios
export const axiosApi = axios.create({
  baseURL: url,
  timeout: 20000,
	headers: {
	  'Content-Type': 'application/json',
	}
})

//configuração do header da requisição do axios, para obter token do firebase
axiosApi.interceptors.request.use(async (options) => {
  await firebaseCheckToken();
  options.headers["Authorization"] = await firebase.auth().currentUser.getIdToken();
  return options;
});

export const createOrganization = async (body) => {
  return axiosApi.post('/organization', body)
  .then( response => response.data )
}

export const updateOrganization = async (body) => {
  return axiosApi.put('/organization/mine', body)
  .then( response => response.data )
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

export const updateMe = async (body) => {
  return axiosApi.put('/user/me', body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const deleteMe = async () => {
  return axiosApi.delete('/user/me')
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

export const getAllDimensions = async (year) => {
  return axiosApi.get('/dimension', {params: year})
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const saveDimension = async (body) => {
  return axiosApi.post('/dimension', body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const deleteAllDimensions = async () => {
  return axiosApi.delete('/dimension')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getDimension = async (id) => {
  return axiosApi.get('/dimension/' + id)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const updateDimension = async (id, body) => {
  return axiosApi.put('/dimension/' + id, body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const deleteDimension = async (id) => {
  return axiosApi.delete('/dimension/' + id)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getAllCriteriaDimension = async (id) => {
  return axiosApi.get('/dimension/' + id + '/criteria')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const saveCriterionDimension = async (id, body) => {
  return axiosApi.post('/dimension/' + id + '/criteria', body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const deleteCriteriasDimension = async (id) => {
  return axiosApi.delete('/dimension/' + id + '/criteria')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getCriterionDimension = async (idDimension, id) => {
  return axiosApi.get('/dimension/' + idDimension + '/criteria/' + id)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const updateCriterionDimension = async (idDimension, id, body) => {
  return axiosApi.put('/dimension/' + idDimension + '/criteria/' + id, body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const deleteCriterionDimension = async (idDimension, id) => {
  return axiosApi.delete('/dimension/' + idDimension + '/criteria/' + id)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getCriterion = async (id) => {
  return axiosApi.get('​/criteria​/' + id)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getAllIndicatorsCriterion = async (idDimension, id) => {
  return axiosApi.get('/dimension/' + idDimension + '/criteria/' + id + '/indicator')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const saveIndicatorCriterion = async (idDimension, id, body) => {
  return axiosApi.post('/dimension/' + idDimension + '/criteria/' + id + '/indicator', body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const deleteAllIndicatorsCriterion = async (idDimension, id) => {
  return axiosApi.delete('/dimension/' + idDimension + '/criteria/' + id + '/indicator')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getIndicatorCriterion = async (idDimension, idCriterion, id) => {
  return axiosApi.get('/dimension/' + idDimension + '/criteria/' + idCriterion + '/indicator/' + id)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const updateIndicatorCriterion = async (idDimension, idCriterion, id, body) => {
  return axiosApi.put('/dimension/' + idDimension + '/criteria/' + idCriterion + '/indicator/' + id, body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const deleteIndicatorCriterion = async (idDimension, idCriterion, id) => {
  return axiosApi.delete('/dimension/' + idDimension + '/criteria/' + idCriterion + '/indicator/' + id)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getIndicator = async (id) => {
  return axiosApi.get('/indicator/' + id)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getUsersList = async (body) => {
  return axiosApi.get('/user', {params: body})
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const grantAdmin = async (id) => {
  return axiosApi.put('/user/' + id + '/grant-admin-permission')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const revokeAdmin = async (id) => {
  return axiosApi.put('/user/' + id + '/revoke-admin-permission')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getOrganizationsList = async (body) => {
  return axiosApi.get('/organization', {params: body})
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const deleteOrganizationById = async (id) => {
  return axiosApi.delete('/organization/' + id)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getAllYears = async () => {
  return axiosApi.get('/year')
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const addYear = async (body) => {
  return axiosApi.post('/year', body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const getYear = async (id) => {
  return axiosApi.get('/year', {params: id})
  axiosApi.get('/year')
 .then( response => response.data )
 .catch(err => {console.log(err);});
}

export const deleteYear = async (id) => {
  return axiosApi.delete('/year/' + id)
 .then( response => response.data )
 .catch(err => {console.log(err);});
}

export const getEvaluationsUser = async (year) => {
  return axiosApi.get('/organization/mine/evaluation/', {params: {year: year}})
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const saveEvaluationsUser = async (body) => {
  return axiosApi.post('/organization/mine/evaluation', body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}

export const updateEvaluationsUser = async (id, body) => {
  return axiosApi.put('/organization/mine/evaluation/' + id, body)
  .then( response => response.data )
  .catch(err => {console.log(err);});
}
