import React, { Component } from 'react'
import Header from '../Header'
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
        <ProductCardList products={data.Products} />
      </main>
    )
  }
}

export default App
