import { createSlice } from '@reduxjs/toolkit'


const imagesSlice = createSlice({
    name: 'images',
    initialState: {
        data: []
    },
    reducers: {
        updateImage: (state, action) => {
            state.data = action.payload
        },
    },
})

export const { updateImage } = imagesSlice.actions
export default imagesSlice.reducer
