import React, { useState, useLayoutEffect, useEffect } from 'react';
import './App.css';
import ProductService from './services/ProductService';
import AdsBanner from './components/AdsBanner';
import ProductsGrid from './components/ProductsGrid';

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

    const incrementPageIndex = () => {
        setPageIndex((prev) => prev + 1);
    };

    const appendNewItems = (newItems = []) => {
        if (newItems.length === 0) {
            return;
        }
        setListings((prev) => [...prev, ...newItems]);
        incrementPageIndex();
    };

    const fetchListing = () => {
        if (!isLoading) {
            setIsLoading(true);
            productService.fetchProductList({ index: pageIndex, limit }, orderBy)
                .then(
                    (response) => {
                        if (Array.isArray(response)) {
                            if (response.length > 0) {
                                appendNewItems(response);
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
    const methods = { appendOrderBy, fetchListing, resetListing, appendNewItems, incrementPageIndex };
    return [data, methods];
}

function preFetchHook(limit = 10, currentIndex = 1, orderBy = [], idleTimeBeforePreFetch = 5) {

    const productService = React.useMemo(() => new ProductService(), []);
    const defaultIdleTimer = { time: 0, timer: null };

    const [isFetching, setIsFetching] = useState(false);
    const [preFetchedList, setPreFetchedList] = useState([]);
    const [idleTimer, setIdleTimer] = useState({ ...defaultIdleTimer });

    const resetPreFetch = () => {
        setIsFetching(false);
        setPreFetchedList([]);
        resetIdleCountdown();
    };

    const initializePreFetch = () => {
        if (isFetching) {
            return;
        }

        setIsFetching(true);

        productService.fetchProductList({ index: currentIndex, limit }, orderBy)
            .then((response) => {
                if (Array.isArray(response)) {
                    setPreFetchedList(response);
                }
            })
            .finally(() => {
                setIsFetching(false);
            });
    };

    const clearTimer = () => {
        if (idleTimer.timer) {
            clearInterval(idleTimer.timer);
        }
    };

    const resetIdleCountdown = () => {
        clearTimer();
        setIdleTimer({ ...defaultIdleTimer });
    };


    const incrementTimer = () => {
        setIdleTimer((prev) => {
            console.log('prev.time', prev.time + 1);
            return { ...prev, time: prev.time + 1 };
        });
    };

    const initializeIdleCountdown = () => {
        resetIdleCountdown();
        setIdleTimer((prev) => {
            const timer = setInterval(() => {
                incrementTimer();
            }, 1000);
            return { time: 0, timer };
        });
    };

    useLayoutEffect(() => {
        if (idleTimer.time >= idleTimeBeforePreFetch) {
            clearTimer();
            initializePreFetch();
        }
    }, [idleTimer]);

    const methods = { initializeIdleCountdown, resetPreFetch };
    const preFetchState = { isFetching, preFetchedList };

    return [preFetchState, methods];
}

const PAGE_SIZE = 5;
const ITEM_COUNT_BEFORE_NEW_ADS = 20;

function App() {

    const [productData, fetchMethods] = productsListingHook(PAGE_SIZE);
    const [preFetchState, preFetchMethods] = preFetchHook(PAGE_SIZE, productData.pageIndex, productData.orderBy);

    const addNewItems = () => {
        if (preFetchState.preFetchedList.length > 0) {
            fetchMethods.appendNewItems(preFetchState.preFetchedList);
        } else {
            fetchMethods.fetchListing();
        }
        preFetchMethods.resetPreFetch();
    };

    const orderBy = (by) => () => {
        fetchMethods.appendOrderBy(by);
        preFetchMethods.resetPreFetch();
    };

    // useLayoutEffect(() => {
    //     console.log('preFetchedList', preFetchState);
    // }, [preFetchState.preFetchedList]);

    useLayoutEffect(() => {
        console.log('productListing', productData.listings);
        console.log('preFetchedList', preFetchState);
        preFetchMethods.resetPreFetch();
        preFetchMethods.initializeIdleCountdown();
    }, [productData.listings]);

    useLayoutEffect(() => {
        fetchMethods.fetchListing();
    }, [productData.orderBy]);

    useLayoutEffect(() => {
        console.log('fetch error', productData.fetchError);
    }, [productData.fetchError]);

    return (
        <div className='app'>
            <h1>Hello World!!</h1>
            <AdsBanner
                productsListing={productData.listings}
                maxViewSize={ITEM_COUNT_BEFORE_NEW_ADS}
                pageSize={PAGE_SIZE}
            />
            <div className='products_container' >
                <ProductsGrid products={productData.listings} />

            </div>
            <h3>{productData.isLoading ? 'loading' : ''}</h3>
            <button onClick={addNewItems}>add item</button>
            <button onClick={orderBy('id')}>order by id</button>
            <button onClick={orderBy('size')}>order by size</button>
            <button onClick={orderBy('price')}>order by price</button>
        </div >
    );
}

export default React.memo(App);
