import React, { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

function AdsBanner({ productsListing, maxViewSize, pageSize }) {

    const [adsId, setAdsId] = useState(0);
    const [adsCounter, setAdsCounter] = useState(0);

    const updateAds = () => {
        if (Array.isArray(productsListing) && productsListing.length > 0) {
            setAdsCounter((prev) => prev + pageSize);
        }
    };

    useLayoutEffect(() => {
        if (adsCounter >= maxViewSize) {
            setAdsCounter(0);
            setAdsId((prev) => {
                let newRand;
                do {
                    newRand = Math.floor(Math.random() * 1000);
                } while (newRand === prev);
                return newRand;
            });
        }

    }, [adsCounter]);

    useLayoutEffect(() => {
        updateAds();
    }, [productsListing]);

    return (
        <header>
            <h1>Products Grid</h1>
            <p>Here you&apos;re sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our selection of ascii faces in an exciting range of sizes and prices.</p>
            <p>But first, a word from our sponsors:</p>
            <img className="ad" src={`/ads/?r=${adsId}`} />
        </header>
    );
}

AdsBanner.propTypes = {
    productsListing: PropTypes.array.isRequired,
    maxViewSize: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default React.memo(AdsBanner);
