// import React, { createContext, useContext } from 'react';
// import { getLoginCredentials } from './loginCredentials';

// export const MyContext = createContext();

// export const MyContextProvider = ({ children }) => {
//   const credentials = getLoginCredentials();

//   return (
//     <MyContext.Provider value={credentials}>
//       {children}
//     </MyContext.Provider>
//   );
// };


import { createContext } from 'react';

export const MyContext = createContext("");