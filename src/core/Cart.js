import React, { useEffect, useState } from 'react'
import '../styles.css';
import { API } from '../backEnd';
import Base from './Base';
import Card from './Card';
import { loadCart } from './helper/cartHelper';
import StripeCheckout from './StripeCheckout';

export default function Cart() {
    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setProducts(loadCart());
    }, [reload]); // calls the useEffect method and it's inner method, while the value of reload gets changed.
    const loadAllProducts = () => {
        return (
            <div>
                {
                    products.map((product, index) => (
                        <Card key={index}
                            product={product}
                            removeFromCart={true}
                            addtoCart={false}
                            setReload={setReload}
                            reload={reload}
                        />
                    ))
                }
            </div>
        );
    }

    const loadCheckOut = () => {
        return (
            <StripeCheckout
                products={products}
                setReload={setReload}
            />
        );
    }


    return (
        <Base title="Cart Page" description="Ready to checkout">
            <div className="row text-center">
                <div className="col-6">{loadAllProducts()}</div>
                <div className="col-6">{loadCheckOut()}</div>
            </div>
        </Base>
    );
}
