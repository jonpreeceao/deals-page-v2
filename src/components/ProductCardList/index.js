import React, { Component } from 'react'
import ProductCard from '../ProductCard'
import styles from './styles'

class ProductCardList extends Component {
  render() {
    const result = (
      <div className={`${styles['c-product-card-list']} o-wrapper`}>
        {this.props.header ? <h3>{this.props.header}</h3> : null}
        <div className={`${styles['c-product-card-list__inner']} o-flex-container`}>
          {this.props.products.map(product => (
            <ProductCard key={product.ProductIdentifier} productData={product} />
          ))}
        </div>
      </div>
    )

    return this.props.header ? <div>{result}</div> : result
  }
}

export default ProductCardList
