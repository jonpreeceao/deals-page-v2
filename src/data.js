const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Catalogue-Service-Api-Key': process.env.API_KEY
}

const url = 'https://beta-catalogueservice.ao-qa.com/api/v1/GetListerPage'

const baseQuery = {
  CatalogueQuery: {
    CategoryIds: [107, 108],
    Formatting: {
      PageSize: 12
    },
    ProductStates: ['LiveProduct']
  },
  CompanyId: 1
}

export function getProductData(query) {
  return fetch(url, {
    method: 'POST',
    headers,
    cors: 'no-cors',
    body: JSON.stringify({ ...baseQuery, ...query })
  }).then(function(response) {
    return response.json()
  })
}
