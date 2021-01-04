// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {isAuthenticated} from './index';

const PrivateRoute = ({component: Component, ...rest}) => (
    //Props means components passsed down to this private route component
    <Route {...rest} render={props => isAuthenticated() ? (
            <Component {...props} />
        ) : (
            <Redirect to={{pathname: "/signin", state: { from: props.location}}} />
        )}
    />
);

export default PrivateRoute;