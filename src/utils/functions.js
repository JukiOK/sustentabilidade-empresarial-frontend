export function paramFromUrl() {
  let url = window.location.href;
  let array = url.substring(url.indexOf('?') + 1).split('&');
  let params = {};
  for(let i = 0; i < array.length; i++) {
    let aux = array[i].split('=');
    params[aux[0]] = aux[1];
  }

  return params;
}
