import React, { createContext, useContext, useReducer } from "react";

//the data layer is created to hold data for other components
export const StateContext = createContext();

//wrap our app and provide the data layer
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

//pull information from data layer
export const useStateValue = () => useContext(StateContext);
