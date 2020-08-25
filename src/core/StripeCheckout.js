import React, { useEffect, useState } from 'react'
import { isAuthenticated } from '../auth/helper'
import { cartEmpty, loadCart } from './helper/cartHelper'
import { Link } from 'react-router-dom';
import StripeCheckoutButton from 'react-stripe-checkout';
import { API } from '../backEnd';
import { createOrder } from './helper/orderHelper';


export default function StripeCheckout({
    products,
    setReload = f => f,
    reload = undefined,
}) {
    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: "",
    });

    const token = isAuthenticated() && isAuthenticated().token;
    const userId = isAuthenticated() && isAuthenticated().user._id;
    const getFinalPrice = () => {
        let amount = 0;
        products.map((product) => {
            amount += product.price;
        });
        return amount;
    }

    const makePayment = (token) => {
        // read documentation
        const body = {
            token,
            products
        }
        const headers = {
            "Content-Type":"application/json"
        }
        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        })
            .then(response => {
                console.log("response is: ", response);
                //call further methods
                const { status } = response;
                console.log("STATUS IS", status);
                cartEmpty(() => {
                    console.log("cart emptied out!!");
                    
                });
                
            }).catch(err=>console.log(err)
            );
    }
    
    const showStripeButton = () => {
        return (
            <StripeCheckoutButton
                stripeKey={process.env.REACT_APP_PUBLISHABLEKEY}
                token={makePayment}
                amount={getFinalPrice() * 100}
                name="Buy Tshirts"
                shippingAddress
                billingAddress
            >
                <button className="btn btn-success my-3">
                    Pay with Stripe
                </button>
            </StripeCheckoutButton>

        ) ;
    }




    return (
        <div>
            {showStripeButton()}
            {API}
        </div>
    );
}
