import React, { Component, Fragment } from 'react'
import styles from './styles.scss'

class Header extends Component {

  render() {
    return (
      <Fragment>
        <header className={styles.header}>
          <picture className={styles.headerImage}>
            <source type="image/jpeg" media="(min-width: 990px)" srcSet="//media.ao.com/uk/promotions/merch/PaydayDealsPage-240718_DPD.jpg" />
            <source type="image/jpeg" media="(min-width: 768px)" srcSet="//media.ao.com/uk/promotions/merch/PaydayDealsPage-240718_DPT.jpg" />
            <img srcSet="//media.ao.com/uk/promotions/merch/PaydayDealsPage-240718_DPM.jpg" alt="Payday Deals" />
          </picture>
        </header>
        <div className={styles.inner}>
          <div className={styles.buttonContainer}>
            <a className={styles.button}>Gifts Under £50</a>
            <a className={styles.button}>Cooling Gifts</a>
            <a className={styles.button}>Fathers Days</a>
            <a className={styles.button}>Electronic Deals</a>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Header
