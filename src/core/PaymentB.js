import React, { useState, useEffect } from 'react'
import { loadCart, cartEmpty } from './helper/cartHelper'
import { Link } from 'react-router-dom'
import { getMeToken, proccessPayment } from './helper/paymentBHelper'
import { createOrder } from './helper/orderHelper'
import { isAuthenticated } from '../auth/helper'
import DropIn from 'braintree-web-drop-in-react'

export default function PaymentB({
    products,
    setReload = f => f,
    reload = undefined,
}) {
    
    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: "",
    });
    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;
    const onPurchase = () => {
        setInfo({
            loading: true,

        });
        let nonce;
        let getnonce = info.instance.requestPaymentMethod()
            .then(data => {
                nonce = data.nonce;
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getAmount(),
                };
                proccessPayment(userId, token, paymentData)
                    .then(response => {
                        setInfo({
                            ...info,
                            loading: false,
                            success: response.success,
                        });
                        console.log("payment success");

                    }).catch(err => {
                        setInfo({
                            ...info,
                            loading: false,
                            success: false,
                        });
                        console.log("payment failed");
                        //TODO: empty the cart
                        cartEmpty(() => {
                            console.log("did we got a crash ?");

                        })

                        //TODO: force reload
                        setReload(!reload);
                    });
            })
    }

    const getAmount = () => {
        let amount = 0;
        products.map(p => {
            amount += p.price;
        })
        return amount;
    }

    const getToken = (userId, token) => {
        getMeToken(userId, token)
            .then(info => {
                console.log("information is: ", JSON.stringify(info));
                if (info.error) {
                    setInfo({
                        ...info,
                        error: info.error,
                    })
                } else {
                    const clientToken = info.clientToken;
                    setInfo({ clientToken });
                }
            }).catch(err => console.log(err));
    }

    const showBrainTreDropIN = () => {
        return (
            <div>
                <DropIn
                    options={{ authorization: info.clientToken }}
                    onInstance={instance => (info.instance = instance)}
                />
                <button
                    className="btn btn-primary"
                    onClick={() => { onPurchase() }}
                >
                    Pay with PayPal
                </button>
            </div>
        );
    }

    useEffect(() => {
        getToken(userId, token);
        console.log("After the refresh the token is: ", JSON.stringify(info));
    }, [])


    return (
        <div className="my-3">
            {showBrainTreDropIN()}
        </div>
    )
}
