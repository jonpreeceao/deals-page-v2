const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Catalogue-Service-Api-Key': process.env.API_KEY
}

const url = 'https://beta-catalogueservice.ao-qa.com/api/v1/GetListerPage'

const configurationPath = './config.json'

let baseConfiguration = {}

export function loadPageConfiguration() {
  return fetch(configurationPath)
    .then(function(response) {
      return response.json()
    })
    .then(function(response) {
      baseConfiguration = response
    })
}

export function getProductData(query) {
  return fetch(url, {
    method: 'POST',
    headers,
    cors: 'no-cors',
    body: JSON.stringify({ ...baseConfiguration, ...query })
  }).then(function(response) {
    return response.json()
  })
}
