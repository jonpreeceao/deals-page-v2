import React, { Component, Fragment } from 'react'
import Header from '../Header'
import Heading from '../Heading'
import ProductCardList from '../ProductCardList'
import TopDealProductCardList from '../TopDealProductCard'
import Spinner from '../Spinner'

import styles from './styles.scss'
import { loadPageConfiguration, getProductData } from '../../data'

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

    return (
      <main className={styles.main}>
        <Header />
        {data.map((section, index) => (
          <Fragment key={index}>
            <Heading
              key={section.heading}
              heading={section.Heading}
              // bgColor="#ededed"
              isDark="true"
            />
            {section.IsSingleProduct ? (
              <TopDealProductCardList
                key={`${index}${section.Heading}`}
                product={section.CatalogueProductDetail}
              />
            ) : (
              <ProductCardList
                key={`${index}${section.Heading}`}
                products={section.Products}
              />
            )}
          </Fragment>
        ))}
      </main>
    )
  }
}

export default App
