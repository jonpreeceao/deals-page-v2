import React, { Component } from 'react'
import ProductCard from '../ProductCard'
import styles from './styles'

class ProductCardList extends Component {
  render() {
    return (
      <div className={styles['c-product-card-list']}>
        <div className={styles['c-product-card-list__track']}>
          {
            this.props.products.map((product) => {
              return <ProductCard key={product.ProductIdentifier} productData={product} />
            })
          }
        </div>
      </div>
    )
  }
}

export default ProductCardList
