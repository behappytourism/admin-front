import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    attrData: {
        title: "",
        attractions: [],
        gallery: [],
        description: "",
    }
}

export const attractionStandAloneSlice = createSlice({
    name: "attrStandAlone",
    initialState,
    reducers : {

        addAttractionStandAloneDatas: (state, { payload })=>{
            if(payload.name === "attraction") {
                if (state.attrData.attractions.length) {
                    const exist = state.attrData.attractions.findIndex((item) => item?._id === payload?.value?._id);
                    if (exist === -1) {
                        state.attrData.attractions.push(payload.value);
                    }
                } else {
                    state.attrData.attractions.push(payload.value);
                }
            } else {
                state.attrData[payload.name] = payload.value
            }
        },

        clearAttractionStandAloneDataAfterAdding: (state, { payload })=>{
            state.attrData = {
                title: "",
                attractions: [],
                gallery: [],
                description: "",
            }
        }, 

        addEditEnitial: (state, { payload })=> {

           if(payload){

               state.attrData = {
                   title: payload?.title,
                   description: payload?.description,
                   gallery: payload?.images,
                   attractions: payload?.attraction
               }
           }

        },

        deleteAddedAttractions: (state, { payload })=>{
            if(state.attrData.attractions.length){
                state.attrData.attractions = state.attrData.attractions.filter((item)=> item?._id !== payload)
            }
        }



    }
})

export const {
    addAttractionStandAloneDatas,
    clearAttractionStandAloneDataAfterAdding,
    addEditEnitial,
    deleteAddedAttractions
} = attractionStandAloneSlice.actions;

export default attractionStandAloneSlice.reducer