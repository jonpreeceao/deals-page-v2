import React, { Component } from 'react'
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
        <h1>Hello, World!</h1>
        <h2 className={styles.header}>Goodbye</h2>
        <button className={styles.button} onClick={this.showMessage}>
          Click Me
        </button>
        <ProductCardList products={productData} />
      </main>
    )
  }
}

export default App
