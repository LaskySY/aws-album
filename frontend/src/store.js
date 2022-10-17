import { configureStore } from '@reduxjs/toolkit'
import imagesReducer from './slice/images';


export default configureStore({
    reducer: {
        'images': imagesReducer
    },
})