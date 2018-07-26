import React, { Component } from 'react'
import styles from './styles.scss'

class Heading extends Component {

  render() {
    let classString = styles['c-heading-divide'];
    if (this.props.isDark === 'true') {
      classString = classString + ' ' + styles['c-heading-divide--dark']
    }

    return (
      <div className="o-wrapper u-pr--tiny u-pl--tiny">
        <h2 className={classString}>
          {this.props.heading}
        </h2>
      </div>
    )
  }
}

export default Heading
