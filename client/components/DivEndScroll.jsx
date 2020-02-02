import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './DivEndScroll.css';

export function scrollAtBottom(el) {
    return Math.ceil(el.scrollHeight - el.scrollTop) === Math.ceil(el.clientHeight);
}

function DivEndScroll({ onEnd, callOnEndIfNoScroll, children }) {
    if (callOnEndIfNoScroll === undefined) {
        callOnEndIfNoScroll = true;
    }

    const fireOnEnd = () => {
        if (typeof onEnd === 'function') {
            onEnd();
        }
    };

    const scrollEvent = (event) => {
        if (scrollAtBottom(event.target)) {
            fireOnEnd();
        }
    };

    const ref = React.createRef();

    useLayoutEffect(() => {
        if (ref.current && scrollAtBottom(ref.current)) {
            fireOnEnd();
        }
    }, [children]);


    return <div className='full_over_flow' ref={ref} onScroll={scrollEvent}>
        {children}
    </div>;
}

// DivEndScroll.displayName = 'DivEndScroll';

DivEndScroll.propTypes = {
    onEnd: PropTypes.func,
    children: PropTypes.array,
    callOnEndIfNoScroll: PropTypes.bool,
    className: PropTypes.string
};

export default React.memo(DivEndScroll);
