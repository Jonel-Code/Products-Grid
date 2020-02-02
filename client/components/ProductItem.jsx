import React from 'react';
import PropTypes from 'prop-types';
import { relativeDateFromNow } from '../util/Date';
import { parseToDollar } from '../util/Number';
import './ProductItem.css';

function ProductItem({ face, size, price, date }) {
    return <div className='product_item' >
        <pre style={{ fontSize: `${size}px` }}>
            {face}
        </pre>
        <hr />
        <p>
            <span>{parseToDollar(price)}</span>
            <br />
            <span>{relativeDateFromNow(new Date(date))}</span>
        </p>
    </div>;
}
ProductItem.propTypes = {
    face: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
};

export default React.memo(ProductItem);
