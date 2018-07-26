import React, { Component } from 'react'
import ProductCard from '../ProductCard'
import styles from './styles'

class ProductCardList extends Component {
  render() {
    return (
      <div className="o-wrapper u-pr--tiny u-pl--tiny">
        <div className={styles['c-product-card-list']}>
          {this.props.products.map(product => (
            <ProductCard key={product.ProductIdentifier} productData={product} />
          ))}
        </div>
      </div>
    )
  }
}

export default ProductCardList
