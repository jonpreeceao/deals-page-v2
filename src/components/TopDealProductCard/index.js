import React from 'react'
import styles from './styles'

function TopDealProductCard(props) {

  const topDeal = props.products.Products["0"]
  console.log('topDeal', topDeal)

  return (
    <div className={styles['c-product-card-list__item']}>
      <div className="sg-grid-example">
        <div className="o-flex-container">
          <div className="o-flex-item u-grid--6">
            <div className="u-p--tiny">
              <img src={`//media.ao.com/en-GB/Productimages/Images/rvSmall/${topDeal.Images.SmallFileName}`} alt={topDeal.Title} />
            </div>
          </div>
          <div className="o-flex-item u-grid--6">
            <div className="u-p--tiny">
              <h6>{topDeal.Title}</h6>
            </div>
          </div>
          <div className="o-flex-item u-grid--12">
            <div className="u-p--tiny">col</div>
          </div>
          <div className="o-flex-item u-grid--12">
            <div className="u-p--tiny">col</div>
          </div>
        </div>
      </div>

      <div>&pound;{topDeal.Price}</div>
    </div>
  )
}

export default TopDealProductCard
