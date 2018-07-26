const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Catalogue-Service-Api-Key': process.env.API_KEY
}

const configurationPath = './config.json'
const companyId = 1
let baseConfiguration = []

export function loadPageConfiguration() {
  return fetch(configurationPath)
    .then(function(response) {
      return response.json()
    })
    .then(function(response) {
      baseConfiguration = response
    })
}

export function getProductData() {
  var requests = []

  baseConfiguration.forEach(config => {
    config.queries.forEach(query => {
      var promise = fetch(config.url, {
        method: 'POST',
        headers,
        cors: 'no-cors',
        body: JSON.stringify({ CompanyId: companyId, ...query })
      })
        .then(response => {
          return response.json()
        })
        .then(result => {
          return {
            Heading: config.heading,
            IsSingleProduct:
              config.url.indexOf('GetProductDetailByProductIdentifier') > -1,
            ...result.Response
          }
        })
      requests.push(promise)
    })
  })

  return Promise.all(requests)
}
