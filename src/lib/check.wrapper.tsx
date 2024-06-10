'use client'
import { createContext, useContext, useState } from "react";
export const CheckContext = createContext<IChecked | null>(null);
export const CheckContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [checked,setChecked] = useState<boolean>(true)
    return (
        <CheckContext.Provider value={{ checked,setChecked }}>
            {children}
        </CheckContext.Provider>
    )
};
export const useCheckContext = () => useContext(CheckContext);