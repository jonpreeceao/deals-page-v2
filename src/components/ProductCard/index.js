import React from 'react'

function ProductCard(props) {

  const { productData } = props;

  return (
    <div className="c-product-card">
      <img src="//placehold.it/300x250" alt="Alt text" />
      <h2>{ productData.Title }</h2>
    </div>
  )
}

export default ProductCard
