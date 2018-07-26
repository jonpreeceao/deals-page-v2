import React, { Component } from 'react'
import Header from '../Header'
<<<<<<< HEAD
import Heading from '../Heading'
import sampleProductData from '../ProductCardList/productData'
=======
>>>>>>> 7b04579183e95b0505e852777cfd1b013e628d07
import ProductCardList from '../ProductCardList'
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
      getProductData().then(result => {
        if (result.Message) {
          return
        }

        this.setState({
          data: result.Response,
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

    if (!data || !data.Products) {
      return null
    }

    return (
      <main className={styles.main}>
        <Header />
<<<<<<< HEAD
        <Heading heading='Our Best Deals' bgColor='#ededed' isDark='true' />
        <ProductCardList products={productData} />
        <Heading heading='Deal of the Day' bgColor='#ededed' isDark='true' />
        <Heading heading='Explore More Deals' bgColor='#ededed' isDark='true' />
=======
        <ProductCardList products={data.Products} />
>>>>>>> 7b04579183e95b0505e852777cfd1b013e628d07
      </main>
    )
  }
}

export default App
