import { API } from "../../backEnd";

export const getMeToken = (userId, token) => {
    return fetch(`${API}/payment/gettoken/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorizattion: `Bearer ${token}`,
        },
    }).then(response => {
        console.log("response is: ", JSON.stringify(response));
        
        return response.json();
    }).catch(err=>console.log(err)
    );
}

export const proccessPayment = (userId,token,paymentInfo) => {
    return fetch(`${API}/payment/braintree/${userId}`, {
        method: "POST", 
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorizattion: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentInfo),
    }).then(response => {
        return response.json();
    }).catch(err=>console.log(err)
    );
}

