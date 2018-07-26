import React, { Component } from 'react'
import Header from '../Header'
import ProductCardList from '../ProductCardList'
import styles from './styles.scss'
import { queryListerPage } from '../../data'

class App extends Component {
  state = {
    message: 'Hello, World!',
    data: []
  }

  componentDidMount() {
    queryListerPage().then(result => {
      if (result.Message) {
        return
      }

      this.setState({
        data: result.Response
      })
    })
  }

  showMessage = () => {
    alert(this.state.message)
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
