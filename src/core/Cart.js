import React, { useEffect, useState } from 'react'
import '../styles.css';
import Base from './Base';
import Card from './Card';
import { loadCart } from './helper/cartHelper';
import StripeCheckout from './StripeCheckout';
import PaymentB from './PaymentB';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';

export default function Cart() {
    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setProducts(loadCart());
        console.log("cart items are: ", JSON.stringify(products));
        console.log("length is:", products.length);

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
            <div className="row">
                <div className="col-6 d-flex flex-row-reverse">
                    <StripeCheckout
                        products={products}
                        setReload={setReload}
                        reload={reload}
                        className="mx-3 center"
                    />
                </div>
                <div className="col-6 d-flex flex-row">
                    <PaymentB
                        product={products}
                        setReload={setReload}
                        reload={reload}
                        className="mx-3 center"
                    />
                </div>
            </div>
        );
    }

    const getFinalPrice = () => {
        let amount = 0;
        products.map(p => {
            amount += p.price;
        })
        return amount;
    }

    return (
        <Base title="Cart Page" description="Ready to checkout">
            <div className="row text-center">
                <div className="col-6">
                    {
                        products.length > 0 ? loadAllProducts() : (<h3>Your cart is Empty.</h3>)
                    }
                </div>
                <div className="col-6">
                    {
                        products.length > 0 ?
                            <h3>
                                Proceed to Pay ${getFinalPrice()}
                                {
                                    isAuthenticated() ? loadCheckOut() :
                                        (
                                            <div className="row">
                                                <div className="col-6 d-flex flex-row-reverse">
                                                    <button className="btn btn-warning my-3 px-4 center">
                                                        <Link className="text-white" to="/signin">SignIn</Link>
                                                    </button>
                                                </div>
                                                <div className="col-6 d-flex flex-row ">
                                                    <button className="btn btn-warning my-3 px-4 center">
                                                        <Link className="text-white" to="/signup">SignUp</Link>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                }
                            </h3>
                            :
                            <h3>Your Cart is Empty</h3>
                    }
                </div>
            </div>
        </Base>
    );



}
