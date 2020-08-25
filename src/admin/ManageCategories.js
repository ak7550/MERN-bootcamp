import React, { useEffect, useState } from 'react'
import Base from '../core/Base'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth/helper'
import { getAllCategories } from './helper/adminapicall';

const ManageCategories = () => {
    const [category, setCategory] = useState([]);
    const { user, token } = isAuthenticated();
    const preload = () => {
        getAllCategories()
            .then(data => {
                console.log(data);
                if (data.error) {
                    console.log("Error is: ", data.error);

                } else {
                    setCategory(data);
                }

            })
            .catch();
    }
    useEffect(() => {
        preload();
    }, []);

    

    return (
        <Base title="Welcome admin" description="Manage products here">
            <h2 className="mb-4">All products:</h2>
            <Link className="btn btn-info" to={`/admin/dashboard`}>
                <span className="">Admin Home</span>
            </Link>
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center text-white my-3">Total {category.length} categories</h2>
                    {
                        
                    }
                </div>
            </div>
        </Base>
    )
}
export default ManageCategories;
