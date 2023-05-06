import React, { Fragment, PureComponent } from 'react';
const CartYears = () =>{
    const year = new Date().getFullYear();
    return (
        Array.from( new Array(10), (v,i) =>
            <option key={i} value={year+i}>{year+i}</option>
        )
    );
}

export default CartYears;