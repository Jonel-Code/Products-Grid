import React from 'react';
import PropTypes from 'prop-types';
import './ProductsGrid.css';
import ProductItem from './ProductItem';

function ProductsGrid({ products }) {
    return <div className='products_grid' >
        {products.map((item, i) =>
            <ProductItem
                key={item.id}
                face={item.face}
                size={item.size}
                price={item.price}
                date={item.date}
            />
        )}
    </div>;
}

ProductsGrid.propTypes = {
    products: PropTypes.array.isRequired
};

export default React.memo(ProductsGrid);
