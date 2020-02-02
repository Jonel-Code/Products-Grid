import React, { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import './AdsBanner.css';
import { Modal, Button } from 'react-bootstrap';

function AdsBanner({ productsListing, maxViewSize, pageSize }) {

    const [adsId, setAdsId] = useState(0);
    const [adsCounter, setAdsCounter] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [advertisementLoaded, setAdvertisementLoaded] = useState(false);
    const modalRef = React.createRef();

    const updateAds = () => {
        if (Array.isArray(productsListing) && productsListing.length > 0) {
            setAdsCounter((prev) => prev + pageSize);
        }
    };

    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const showAdvertisement = () => {
        setAdsId((prev) => {
            let newRand;
            do {
                newRand = Math.floor(Math.random() * 1000);
            } while (newRand === prev);
            return newRand;
        });

        setAdsCounter(0);
        setAdvertisementLoaded(false);
        openModal();
    };

    const onImageLoad = (event) => {
        setAdvertisementLoaded(true);
    };

    useLayoutEffect(() => {
        if (adsCounter >= maxViewSize) {
            showAdvertisement();
        }
    }, [adsCounter]);

    useLayoutEffect(() => {
        updateAds();
    }, [productsListing]);

    return (
        <>
            <Modal
                backdrop='static'
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showModal}
                onHide={closeModal}
                keyboard={advertisementLoaded}
            >
                <Modal.Header closeButton={advertisementLoaded} >
                    <Modal.Title>
                        <h1>Products Grid</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <header className="modal_text">
                        <p>Here you&apos;re sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our selection of ascii faces in an exciting range of sizes and prices.</p>
                        <p>But first, a word from our sponsors:</p>
                        {!advertisementLoaded
                            ? <div className="spinner-grow text-info" style={{ width: '4em', height: '4em' }}>
                                <span className="sr-only">Loading...</span>
                            </div>
                            : ''}
                        <img hidden={!advertisementLoaded} onLoad={onImageLoad} className="ad" src={`/ads/?r=${adsId}`} />
                    </header>
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={!advertisementLoaded} variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

AdsBanner.propTypes = {
    productsListing: PropTypes.array.isRequired,
    maxViewSize: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default React.memo(AdsBanner);
