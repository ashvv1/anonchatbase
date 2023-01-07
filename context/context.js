import { getAuth } from "firebase/auth";
import { createContext } from 'react';

export const Auth = createContext(null)

function Context({ children }) {

    const auth = getAuth();
    
    return (
      <Auth.Provider value={{ auth }}>
        {children}
      </Auth.Provider>
    );
  }

  export default Context;