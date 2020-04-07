import React, { useState, createContext } from 'react';
import { sessionService } from '../sessionServices/sessionServices';
export const LoginContext = createContext();

export const LoginProvider = props => {
    const [user, setUser] = useState(sessionService.getUser() || null);

    return (
        // passing state and function that set state
        <LoginContext.Provider value={{ user, setUser }}>
            {props.children}
        </LoginContext.Provider>
    );
};

export default LoginProvider;