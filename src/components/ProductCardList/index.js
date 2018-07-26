import React, { Component } from 'react'
import ProductCard from '../ProductCard'

class ProductCardList extends Component {
  render() {
    return (
      <div>{ this.props.products.map((product) => <ProductCard productData={product} />) }</div>
    )
  }
}

export default ProductCardList
