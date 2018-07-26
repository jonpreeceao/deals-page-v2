const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Catalogue-Service-Api-Key': process.env.API_KEY
}

const url = 'https://beta-catalogueservice.ao-qa.com/api/v1/GetListerPage'

const query = {
  CatalogueQuery: {
    CategoryIds: [107, 108],
    Criteria: [
      {
        Name: 'yesnofeatures',
        Values: ['3302'],
        CriteriaType: 'Or'
      }
    ],
    Formatting: {
      PageSize: 12
    },
    ProductStates: ['LiveProduct']
  },
  CompanyId: 1
}

export function queryListerPage() {
  return fetch(url, {
    method: 'POST',
    headers,
    cors: 'no-cors',
    body: JSON.stringify(query)
  }).then(function(response) {
    return response.json()
  })
}
