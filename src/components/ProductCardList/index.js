import React, { Component } from 'react'
import ProductCard from '../ProductCard'
import styles from './styles'

class ProductCardList extends Component {
  render() {
    return (
      <div className={`${styles['c-product-card-list']} o-wrapper`}>
        <div className={`${styles['c-product-card-list__inner']} o-flex-container`}>
          {this.props.products.map(product => (
            <ProductCard key={product.ProductIdentifier} productData={product} />
          ))}
        </div>
      </div>
    )
  }
}

export default ProductCardList
