import { createContext, useReducer, useEffect } from 'react';
import reducers from './Reducers';
import Cookie from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const router = useRouter();
    const [socket, setSocket] = useState(null);
    const initialState = {
        notify: {}, auth: {}, modal: [], orders: [], users: [], categories: [], loading: {}
    }

    const [state, dispatch] = useReducer(reducers, initialState);

    useEffect(() => {
        const socket = io.connect("https://valtrade-api.tech", {
            transports: ["websocket", "polling"]
        });
        setSocket(socket);
        if (!Cookie.get('admin_token') && !['/signin', '/verify'].includes(router.pathname)) {
            router.push('/signin');
        }
    }, [])

    return (
        <DataContext.Provider value={{ state, dispatch, socket }}>
            {children}
        </DataContext.Provider>
    )
}