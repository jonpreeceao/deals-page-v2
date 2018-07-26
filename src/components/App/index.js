import React, { Component } from 'react'
import styles from './styles.scss'

import Header from '../Header'

class App extends Component {
  state = {
    message: 'Hello, World!'
  }

  showMessage = () => {
    alert(this.state.message)
  }

  render() {
    return (
      <Header />
    )
  }
}

export default App
