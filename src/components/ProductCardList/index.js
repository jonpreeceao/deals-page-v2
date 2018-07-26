import React, { Component } from 'react'
import ProductCard from '../ProductCard'

class ProductCardList extends Component {
  render() {
    return (
      <div className="c-product-card-list">
        {
          this.props.products.map((product) => {
            return <ProductCard key={product.ProductIdentifier} productData={product} />
          })
        }
      </div>
    )
  }
}

export default ProductCardList
