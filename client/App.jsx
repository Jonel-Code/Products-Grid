import React, { useState, useLayoutEffect, useEffect } from 'react';
import './App.css';
import ProductService from './services/ProductService';
import AdsBanner from './components/AdsBanner';

function mapProductItem(product) {
    return { ...product, date: new Date(product.date) };
}

function productsListingHook(limit = 10) {

    const productService = React.useMemo(() => new ProductService(), []);

    const [listings, setListings] = useState([]);
    const [isEndOfListing, setIsEndOfListing] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [orderBy, setOrderBy] = useState([]);

    const resetListing = () => {
        setListings([]);
        setPageIndex(1);
        setIsEndOfListing(false);
        setIsLoading(false);
    };

    const appendOrderBy = (order) => {
        if (isLoading) {
            return;
        }
        resetListing();
        setOrderBy((prev) => {
            if (prev.includes(order)) {
                prev.splice(prev.indexOf(order), 1);
            } else {
                prev.push(order);
            }
            return [...prev];
        });
    };

    const fetchListing = () => {
        if (!isLoading) {
            setIsLoading(true);
            productService.fetchProductList({ index: pageIndex, limit }, orderBy)
                .then(
                    (response) => {
                        if (Array.isArray(response)) {
                            if (response.length > 0) {
                                setPageIndex((prev) => prev + 1);
                                setListings((prev) => [...prev, ...response.map(mapProductItem)]);
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

    const data = { listings, isEndOfListing, fetchError, isLoading, orderBy, pageIndex };
    const methods = { appendOrderBy, fetchListing, resetListing };
    return [data, methods];
}

const PAGE_SIZE = 5;
const maxViewSize = 10;

function App() {

    const [productData, methods] = productsListingHook(PAGE_SIZE);

    useLayoutEffect(() => {
        console.log('productListing', productData.listings);
    }, [productData.listings]);

    useLayoutEffect(() => {
        methods.fetchListing();
    }, [productData.orderBy]);

    useLayoutEffect(() => {
        console.log('fetch error', productData.fetchError);
    }, [productData.fetchError]);
    return (
        <div className='app'>
            <h1>Hello World!!</h1>
            <AdsBanner
                productsListing={productData.listings}
                maxViewSize={maxViewSize}
                pageSize={PAGE_SIZE}
            />
            <h3>{productData.isLoading ? 'loading' : ''}</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(productData.listings)}</pre>
            <button onClick={methods.fetchListing}>add item</button>
            <button onClick={() => methods.appendOrderBy('id')}>order by id</button>
            <button onClick={() => methods.appendOrderBy('size')}>order by size</button>
            <button onClick={() => methods.appendOrderBy('price')}>order by price</button>
        </div>
    );
}

export default React.memo(App);
