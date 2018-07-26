import React, { Component, Fragment } from 'react'
import Header from '../Header'
import Heading from '../Heading'
import ProductCardList from '../ProductCardList'
import TopDealProductCardList from '../TopDealProductCard'
import Spinner from '../Spinner'

import styles from './styles.scss'
import { loadPageConfiguration, getProductData } from '../../data'
import groupBy from '../../utils/groupby'

class App extends Component {
  state = {
    data: [],
    loading: true
  }

  componentDidMount() {
    loadPageConfiguration().then(() => {
      getProductData().then(results => {
        this.setState({
          data: results,
          loading: false
        })
      })
    })
  }

  render() {
    const { data, loading } = this.state

    if (loading) {
      return <Spinner />
    }

    if (!data || !data.length) {
      return null
    }

    var sections = groupBy(data, 'Heading')

    return (
      <main className={styles.main}>
        <Header />
        {Object.keys(sections).map((sect, index) => {
          return sections[sect].map((section, ind) => {
            return (
              <Fragment key={ind}>
                {ind === 0 && (
                  <Heading
                    key={section.Heading}
                    heading={section.Heading}
                    isDark="true"
                  />
                )}
                {section.IsSingleProduct ? (
                  <TopDealProductCardList
                    key={`${ind}${section.Heading}`}
                    product={section.CatalogueProductDetail}
                  />
                ) : (
                  <ProductCardList
                    header={sections[sect].length > 1 ? `${section.Title}` : null}
                    total={section.TotalProductCount}
                    key={`${ind}${section.Heading}`}
                    products={section.Products}
                  />
                )}
              </Fragment>
            )
          })
        })}
      </main>
    )
  }
}

export default App
