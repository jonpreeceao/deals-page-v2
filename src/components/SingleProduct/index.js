import React from 'react'
import styles from './styles'

function SingleProduct(props) {
  const { productData } = props

  return (
    <div className={styles['c-product-card-list__item']}>
      <img
        src={`//media.ao.com/brandlogos/en-GB/${
          productData.CatalogueProductSummary.Images.BrandFileName
        }`}
        alt={productData.CatalogueProductSummary.Brand}
      />
      <img
        src={`//media.ao.com/en-GB/Productimages/Images/rvSmall/${
          productData.CatalogueProductSummary.Images.SmallFileName
        }`}
        alt={productData.CatalogueProductSummary.Title}
      />
      <div>&pound;{productData.CatalogueProductSummary.Price}</div>
      <h2>{productData.CatalogueProductSummary.Title}</h2>
      <div>{productData.CatalogueProductSummary.Rating}</div>
    </div>
  )
}

export default SingleProduct
