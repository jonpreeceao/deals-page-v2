import React, { Component } from 'react'
import Header from '../Header'
import ProductCardList from '../ProductCardList'
import styles from './styles.scss'
import { getProductData } from '../../data'

class App extends Component {
  state = {
    data: []
  }

  componentDidMount() {
    getProductData({
      CatalogueQuery: {
        CategoryIds: [107, 108]
      }
    }).then(result => {
      if (result.Message) {
        return
      }

      this.setState({
        data: result.Response
      })
    })
  }

  render() {
    const { data } = this.state
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
