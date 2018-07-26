import React, { Component } from 'react'
import styles from './styles.scss'

class Heading extends Component {

  render() {
    return (
      <div className={styles.inner}>
        <h2 className={this.props.isDark === 'true' ? styles.linethroughDark : styles.linethroughLight}>
          <span style={{ backgroundColor: this.props.bgColor }}>{this.props.heading}</span>
        </h2>
      </div>
    )
  }
}

export default Heading
