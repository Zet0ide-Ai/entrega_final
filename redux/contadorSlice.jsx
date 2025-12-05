import { createSlice } from "@reduxjs/toolkit";

const contadorSlice= createSlice({
    name: 'contador',
    initialState:{valor:0},
    reducers:{
        incrementar:(state)=>{
            state.valor+=1
        },
        reducir:(state)=>{
            state.valor-=1
        },
        reiniciar:(state)=>{
            state.valor==0
        }


    }
})

export const{incrementar,decrementar,reiniciar} = contadorSlice.actions
export default contadorSlice.reducer;