import React, { Component } from 'react'
import ProductCard from '../ProductCard'
import styles from './styles'

class ProductCardList extends Component {
  render() {
    const result = (
      <div className={`${styles['c-product-card-list']} o-wrapper`}>
        {this.props.header ? (
          <h3 className={`${styles['c-product-card-list-heading']} u-pr--small u-pl--small`}>
            {this.props.header}
            <small>({this.props.total})</small>
          </h3>
        ) : null}
        <div className={`${styles['c-product-card-list__inner']} o-flex-container`}>
          {this.props.products.map(product => (
            <ProductCard key={product.ProductIdentifier} productData={product} />
          ))}
        </div>
      </div>
    )

    return (
      this.props.header ?
        <div className={`${styles['c-product-card-list--category']} u-pt--small u-pb--small`}>{result}</div>
        :
        result
    )
  }
}

export default ProductCardList
