import React from 'react'
import { parseRatingClass } from '../../utils/product'
import styles from './styles'

function TopDealProductCard(props) {
  const topDeal = props.product

  return (
    <div className={styles['c-product-card-list__item']}>
      <div className="sg-grid-example">
        <div className="o-flex-container">
          <div className="o-flex-item u-grid--6">
            <div className="u-p--tiny">
              <img
                src={`//media.ao.com/en-GB/Productimages/Images/rvSmall/${
                  topDeal.CatalogueProductSummary.Images.SmallFileName
                }`}
                alt={topDeal.CatalogueProductSummary.Title}
              />
            </div>
          </div>
          <div className="o-flex-item u-grid--6">
            <div className="u-p--tiny">
              <h6>{topDeal.CatalogueProductSummary.Title}</h6>
              <div className={styles.rating}>
                <div
                  className={
                    'stars rating-sprite-' +
                    parseRatingClass(topDeal.CatalogueProductSummary.Rating)
                  }
                />
                <div>
                  {topDeal.CatalogueProductSummary.Rating} ({
                    topDeal.CatalogueProductSummary.ReviewCount
                  })
                </div>
              </div>
              <p className={styles.price}>
                &pound;{topDeal.CatalogueProductSummary.Price}
              </p>
            </div>
          </div>
          <div className="o-flex-item u-grid--12">
            <div className="u-p--tiny">
              <ul>
                {topDeal.CatalogueProductSummary.FeatureDescriptions.map(
                  (feature, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: feature }} />
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="o-flex-item u-grid--12">
            <div className="u-p--tiny">col</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopDealProductCard
