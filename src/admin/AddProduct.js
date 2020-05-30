import React, { useState, useEffect } from 'react'
import Base from '../core/Base'
import { Link, Redirect } from 'react-router-dom'
import { getAllCategories, createProduct } from './helper/adminapicall';
import { isAuthenticated } from '../auth/helper/index';

const AddProduct = () => {
    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        photo: "",
        categories: [],
        category: "",
        loading: false,
        error: "",
        createdProduct: "",
        didRedirect: false,
        formData: "",
    });

    const { user, token } = isAuthenticated();
    const { name, description, price, stock, categories, category, loading, error, createdProduct, didRedirect, formData } = values;
    const onSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: "", loading: true });
        console.log("before sending to the server, formdata is: ", (formData));
        createProduct(user._id, token, formData)
            .then(data => {
                console.log(`Data is: ` + JSON.stringify(data));
                if (data.error) {
                    setValues({
                        ...values,
                        loading: false,
                        error: data.error
                    });
                } else {
                    setValues({
                        ...values,
                        name: "",
                        description: "",
                        price: "",
                        photo: "",
                        stock: "",
                        loading: false,
                        createdProduct: data.name,
                        didRedirect: true,
                    });
                }
            })
            .catch(err => {
                setValues({ ...values, error: err });
                console.log(err)
            });
    }

    const handleChange = name => event => {
        console.log(event.target);
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        console.log(`Value that we got is: ${value}`);
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    }
    const preLoad = () => {
        getAllCategories()
            .then(data => {
                // if everythig is well, it should return all the category information as an interable object as data
                console.log("Data is: " + JSON.stringify(data));
                if (data.error) {
                    setValues({
                        ...values,
                        error: data.error,
                    });
                }
                else {
                    setValues({
                        ...values,
                        categories: data,
                        formData: new FormData(),
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        preLoad();
    }, []);

    const createProductForm = () => (
        <form >
            <span>Post photo</span>
            <div className="form-group">
                <label className="btn btn-block btn-success">
                    <input
                        onChange={handleChange("photo")}
                        type="file"
                        accept="image"
                        placeholder="choose a file"
                    />
                </label>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("name")}
                    name="photo"
                    className="form-control"
                    placeholder="Name"
                    type="text"
                />
            </div>
            <div className="form-group">
                <textarea
                    onChange={handleChange("description")}
                    className="form-control"
                    placeholder="Description"
                    type="text"
                />
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("price")}
                    type="number"
                    className="form-control"
                    placeholder="Price"
                />
            </div>
            <div className="form-group">
                <select
                    onChange={handleChange("category")}
                    className="form-control"
                    placeholder="Category"
                >
                    <option>Select</option>
                    {
                        console.log("loaded categories are: ", categories)
                        // this is working
                    }
                    {categories &&
                        categories.map((category, index) => {
                            console.log(`Index of ${category} is: ${index}`);

                            return (
                                <option
                                    key={index}
                                    value={category._id}
                                >
                                    {category.name}
                                </option>
                            );
                        })
                    }
                </select>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("stock")}
                    type="number"
                    className="form-control"
                    placeholder="Quantity"
                />
            </div>

            <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3 ">
                Create Product
            </button>
        </form>
    );

    const successMessage = () => (
        <div className="alert alert-success mt-3"
            style={{ display: createdProduct ? "" : "none" }}
        >
            <h4>{createdProduct} is created successfully</h4>
        </div>
    )
    const warningMessage = () => (
        <div className="alert alert-warning mt-3"
            style={{ display: error ? "" : "none" }}
        >
            <h4>{error}</h4>
        </div>
    )
    const loadingMessage = () => (
        <div className="alert alert-info mt-3"
            style={{ display: loading ? "" : "none" }}
        >
            <h4>Loading...</h4>
        </div>
    )

    const performRedirect = () => {
        console.log("Inside of performredirect, the value is: ", didRedirect);
        
        didRedirect && setTimeout( function() {
            console.log("working");
            //BUG: not working
            return <Redirect to="/admin/dashboard" />;
        }, 2000);
        
    }


    return (
        <div>
            <Base
                title="Add Product Here!"
                description="Product creation section"
                className="container bg-info p-4"
            >
                <Link to="/admin/dashboard"
                    className="btn btn-md btn-dark mb-3"
                >Admin Home</Link>
                <div className="row bg-dark text-white rounded">
                    <div className="col-md-8 offset-md-2">
                        {loadingMessage()}
                        {successMessage()}
                        {warningMessage()}
                        {performRedirect()}
                        {createProductForm()}
                        {
                            console.log(didRedirect)
                        }
                    </div>
                </div>
            </Base>
        </div>
    )
}
export default AddProduct;
