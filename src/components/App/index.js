import React, { Component } from 'react'
import Header from '../Header'
<<<<<<< HEAD
import Heading from '../Heading'
import sampleProductData from '../ProductCardList/productData'
=======
>>>>>>> 7b04579183e95b0505e852777cfd1b013e628d07
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
