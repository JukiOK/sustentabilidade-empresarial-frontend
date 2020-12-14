export const SET_ORGANIZATION = 'SET_ORGANIZATION';
export const REMOVE_ORGANIZATION = 'REMOVE_ORGANIZATION';

export function setOrganization(body) {
  return {
    type: SET_ORGANIZATION,
    body
  }
}

export function removeOrganization() {
  return {
    type: REMOVE_ORGANIZATION
  }
}
