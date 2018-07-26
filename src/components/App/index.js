import React, { Component } from 'react'
import Header from '../Header'
import Heading from '../Heading'
import sampleProductData from '../ProductCardList/productData'
import ProductCardList from '../ProductCardList'
import styles from './styles.scss'

const productData = sampleProductData.Response.Products


class App extends Component {
  state = {
    message: 'Hello, World!'
  }

  showMessage = () => {
    alert(this.state.message)
  }

  render() {
    return (
      <main className={styles.main}>
        <Header />
        <Heading heading='Our Best Deals' bgColor='#ededed' isDark='true' />
        <ProductCardList products={productData} />
        <Heading heading='Deal of the Day' bgColor='#ededed' isDark='true' />
        <Heading heading='Explore More Deals' bgColor='#ededed' isDark='true' />
      </main>
    )
  }
}

export default App
