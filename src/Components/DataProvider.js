import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('https://restcountries.com/v2/all')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <DataContext.Provider value={data}>
            {children}
        </DataContext.Provider>
    );
};
