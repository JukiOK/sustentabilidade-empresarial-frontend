export const SET_INVITES = 'SET_INVITES';
export const SET_HAS_NEW = 'SET_HAS_NEW';

export function setInvites(list) {
  return {
    type: SET_INVITES,
    list,
  }
}

export function setHasNew(bool) {
  return {
    type: SET_HAS_NEW,
    bool,
  }
}
