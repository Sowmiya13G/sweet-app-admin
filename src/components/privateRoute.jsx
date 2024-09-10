import React from 'react';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component }) => {
    const isAuthenticated = useSelector((state) => state?.isAuthenticated);

    return isAuthenticated ? <Component /> : <Component/>;
};

export default PrivateRoute;
