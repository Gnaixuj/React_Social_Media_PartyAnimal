import React from 'react'
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = props => {
    console.log(props); // TBR
    const { component: Component, authenticated, ...rest } = props
    return (
        <Route 
            {...rest}
            render={(props) => {
                return authenticated ? <Redirect to="/"/> : <Component {...props}/>
            }}
        />
)};

export default AuthRoute;