import React from 'react'

function ProductCard(props) {

  const { productData } = props;

  return (
    <div className="c-product-card">
      <img src={`//media.ao.com/brandlogos/en-GB/${productData.Images.BrandFileName}`} alt={productData.Brand} />
      <img src={`//media.ao.com/en-GB/Productimages/Images/rvSmall/${productData.Images.SmallFileName}`} alt={productData.Title} />
      <div>&pound;{productData.Price}</div>
      <h2>{ productData.Title }</h2>
      <div>{ productData.Rating }</div>
    </div>
  )
}

export default ProductCard
