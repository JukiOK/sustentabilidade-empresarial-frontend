export const SET_INVITES = 'SET_INVITES';

export function setInvites(list) {
  return {
    type: SET_INVITES,
    list,
  }
}
