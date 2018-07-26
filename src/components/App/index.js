import React, { Component, Fragment } from 'react'
import Header from '../Header'
import Heading from '../Heading'
import ProductCardList from '../ProductCardList'
import SingleProduct from '../SingleProduct'
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
        {data.map(
          (section, index) =>
            section.IsSingleProduct ? (
              <Fragment>
                <Heading heading={section.Heading} bgColor="#ededed" isDark="true" />
                <SingleProduct
                  key={`${index}${section.Heading}`}
                  productData={section.CatalogueProductDetail}
                />
              </Fragment>
            ) : (
              <Fragment>
                <Heading heading={section.Heading} bgColor="#ededed" isDark="true" />
                <ProductCardList
                  key={`${index}${section.Heading}`}
                  products={section.Products}
                />
              </Fragment>
            )
        )}
        <Heading heading="Deal of the Day" bgColor="#ededed" isDark="true" />
        <Heading heading="Explore More Deals" bgColor="#ededed" isDark="true" />
      </main>
    )
  }
}

export default App
