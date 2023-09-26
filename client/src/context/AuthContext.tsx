import { createContext, ReactNode, useEffect, useState } from "react";

import { User } from "../utils/types";


interface AuthContextValue {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const storedUser = localStorage.getItem('rtc_user');

const initialData = storedUser ? JSON.parse(storedUser) : null;

export const AuthContext = createContext<AuthContextValue>({
    user: initialData,
    setUser: () => { },
});

interface AuthProviderProps {
    children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(initialData);

    const contextValue: AuthContextValue = {
        user,
        setUser,
    }

    useEffect(() => {
        if (user) {
            localStorage.setItem('rtc_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('rtc_user');
        }
    }, [user])
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
