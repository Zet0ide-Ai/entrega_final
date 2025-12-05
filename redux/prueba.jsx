import { configureStore } from "@reduxjs/toolkit";
import contadorReducer from './contadorSlice'

export const store= configureStore({

    reducer:{
        contador: contadorReducer, 
    }

})