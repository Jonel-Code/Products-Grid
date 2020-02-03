import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import './DivBottomScroll.css';

export function scrollAtBottom(el) {
    if (!el) {
        return false;
    }
    return Math.ceil(el.scrollHeight - el.scrollTop) === Math.ceil(el.clientHeight);
}


function DivBottomScroll({ onBottomScroll, callOnEndIfNoScroll, children }) {
    if (callOnEndIfNoScroll === undefined) {
        callOnEndIfNoScroll = true;
    }

    const divRef = React.createRef();

    const fireOnBottom = () => {
        if (typeof onBottomScroll === 'function') {
            onBottomScroll();
        }
    };

    const scrollEvent = (event) => {
        if (!(divRef.current || event.target)) {
            return;
        }
        // since on scroll also fires on child's scroll events
        // we must check if the reference element is the same with the target element
        // check if the reference is the same so that it will not fire on other scroll
        if (divRef.current === event.target && scrollAtBottom(event.target)) {
            fireOnBottom();
        }
    };

    // check if the children has been updated and fire if the scroll is on the bottom
    useLayoutEffect(() => {
        if (divRef.current && scrollAtBottom(divRef.current)) {
            fireOnBottom();
        }
    }, [children]);

    return <div className='full_over_flow' ref={divRef} onScroll={scrollEvent}>
        {children}
    </div>;
}

DivBottomScroll.propTypes = {
    onBottomScroll: PropTypes.func,
    children: PropTypes.array,
    callOnEndIfNoScroll: PropTypes.bool,
    className: PropTypes.string
};

export default React.memo(DivBottomScroll);
