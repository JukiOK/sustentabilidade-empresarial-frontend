export const SET_USER = 'SET_USER';

export function setUser(user) {
  return {
    type: SET_USER,
    user,
  }
}

export function userLogout() {
  return {
    type: 'USER_LOGOUT',
  }
}
