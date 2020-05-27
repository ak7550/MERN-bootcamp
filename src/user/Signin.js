import React, { useState } from 'react';
import Base from '../core/Base';
import { Redirect } from 'react-router-dom';
import { signin, authenticate, isAuthenticated } from '../auth/helper/index';

const Signin = () => {

    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        success: false,
        didRedirect: false, // it's gonna redirect the user to user dashboard or admin dashboard after a succesful authentication
    });

    const { email, password, success, didRedirect, loading, error } = values; // object destructured

    // check higherOrder functions
    const handleChange = name => event => {
        setValues({ ...values, error: "", [name]: event.target.value });
    };

    const { user } = isAuthenticated(); // return JSON.parse(localStorage.getItem("jwt"));

    const onSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true });
        signin({ email, password }) // this methods automatically sends an request to the server and returns a server side response, that we need to deal accordingly
            .then(data => {
                if (data.err) {
                    setValues({ ...values, error: data.err, success: false, didRedirect: false });
                }
                else {
                    authenticate(data, () => {
                        setValues({
                            ...values,
                            didRedirect: true,
                            success: true,
                        })
                    })
                }
            })
            .catch(err => {
                console.log("Error is: " + err); // not possible to reach the server
            });
    };

    const signInForm = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form action="">
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input className="form-control" onChange={handleChange("email")} type="email"
                                value={email}
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-light">Password</label>
                            <input className="form-control"
                                value={password}
                                onChange={handleChange("password")} type="password" />
                        </div>
                        <div className="btn btn-success btn-block" onClick={onSubmit}>Submit</div>
                    </form>
                </div>
            </div>
        );
    }

    // still redirecting me to user dashboard if the password is wrong, jwt web token is not being generated
    const performRedirect = () => {
        //TODO: do a redirection here
        if (didRedirect) {
            if (user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />;
            }
            else {
                return <Redirect to="/user/dashboard" />;
            }
        }
        if (isAuthenticated()) {
            return <Redirect to="/" />
        }
    }

    const loadingMesssage = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    {loading && (
                        <div className="alert alert-info">
                            <h2>Loading...</h2>
                        </div>)}
                </div>
            </div>
        ); // if loading is true the 2nd parameter is definately is gonna run and return true
    };

    const errorMesssage = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">

                    <div className="alert alert-danger"
                        style={{ display: error ? "" : "none" }}
                    >
                        {error}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Base title="Signin Page" description="A page for a user to Signin!">
            {loadingMesssage()}
            {errorMesssage()}
            {signInForm()}
            {performRedirect()}
            <p className="text-white text-center">
                {JSON.stringify(values)}
            </p>
        </Base>
    );
};

export default Signin;