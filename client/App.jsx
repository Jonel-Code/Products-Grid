import React, { useState, useLayoutEffect, useEffect } from 'react';
import './App.css';
import ProductService from './services/ProductService';

function mapProductItem(product) {
    return { ...product, date: new Date(product.date) };
}

function productsListingHook(limit = 10, sortBy = []) {

    const productService = React.useMemo(() => new ProductService(), []);

    const [listings, setListings] = useState([]);
    const [isEndOfListing, setIsEndOfListing] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);

    const fetchListing = () => {
        if (!isLoading) {
            setIsLoading(true);
            productService.fetchProductList({ index: pageIndex, limit }, sortBy)
                .then(
                    (response) => {
                        if (Array.isArray(response)) {
                            if (response.length > 0) {
                                setListings((prev) => [...prev, ...response.map(mapProductItem)]);
                                setPageIndex((prev) => prev + 1);
                            }
                            setIsEndOfListing(() => response.length > 0);
                        }
                    }
                )
                .catch(error => {
                    setFetchError(() => error);
                    return null;
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const data = { listings, isEndOfListing, fetchError, isLoading };

    return [data, fetchListing];
}

function App() {

    const [productData, fetchListing] = productsListingHook(5);

    useLayoutEffect(() => {
        console.log('productListing', productData.listings);
    }, [productData.listings]);

    useLayoutEffect(() => {
        fetchListing();
    }, []);

    useLayoutEffect(() => {
        console.log('fetch error', productData.fetchError);
    }, [productData.fetchError]);


    return (
        <div className='app'>
            <h1>Hello World!!</h1>
            <h3>{productData.isLoading ? 'loading' : ''}</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(productData.listings)}</pre>
            <button onClick={fetchListing}>add item</button>
        </div>
    );
}

export default React.memo(App);
