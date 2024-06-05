// src/components/PrivateRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component }) => {
    const isAuthenticated = useSelector((state) => state?.isAuthenticated);

    return isAuthenticated ? <Component /> : <Component/>;
};

export default PrivateRoute;
