import React, { Component, Fragment } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'

class Header extends Component {

  render() {
    var classes = classnames(
      {[styles.dpPill]: true},
      'c-btn c-btn--pill u-mr--tiny u-ml--tiny dp-pill'
    )
    return (
      <Fragment>
        <header className={styles.header}>
          <picture className={styles.headerImage}>
            <source type="image/jpeg" media="(min-width: 990px)" srcSet="//media.ao.com/uk/promotions/merch/deals-bannerUPDATED-141117_DPD.jpg" />
            <source type="image/jpeg" media="(min-width: 768px)" srcSet="//media.ao.com/uk/promotions/merch/deals-banner-141117_DPT.jpg" />
            <img srcSet="//media.ao.com/uk/promotions/merch/deals-banner2-141117_DPM.jpg" alt="Black Friday Deals" />
          </picture>
        </header>
        <div className={styles.inner}>
          <div className={styles.buttonContainer}>
            <button className={classes}>Gifts Under £50</button>
            <button className={classes}>Gifts Under £50</button>
            <button className={classes}>Gifts Under £50</button>
            <button className={classes}>Gifts Under £50</button>
            <button className={classes}>Gifts Under £50</button>
            <button className={classes}>Gifts Under £50</button>
            <button className={classes}>Gifts Under £50</button>
            <button className={classes}>Gifts Under £50</button>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Header
