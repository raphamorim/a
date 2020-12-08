const APIROUTES = {
  getToken: 'http://localhost:8080/get-token/',
  getUserData: 'http://localhost:8080/get-data/'
}

export function getToken(code) {
  return fetch(APIROUTES.getToken + code)
    .then(function(response) {
    return response.json();
  }).then(function(data) {
    if (data && data.access_token) {
      const { access_token } = data;
      return access_token;
    }
  });
}

export function getAccountData(token) {
  return fetch(APIROUTES.getUserData + token) // TODO: fix this flow :/
    .then(function(response) {
    return response.json();
  }).then(function(data) {
    if (data) {
      return data;
    }
  });
}