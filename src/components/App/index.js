import React, { Component } from 'react'
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
        <Heading heading='Our Best Deals' bgColor='#ededed' isDark='true' />
        <TopDealProductCardList products={data} />
        <ProductCardList products={data} />
        <Heading heading='Deal of the Day' bgColor='#ededed' isDark='true' />
        <Heading heading='Explore More Deals' bgColor='#ededed' isDark='true' />
      </main>
    )
  }
}

export default App
