import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import { Provider } from 'react-redux'
import store from './store'
import Home from './components/home'
import Uploader from './components/uploader'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="upload" element={<Uploader />} />
            </Routes>
        </BrowserRouter>
    </Provider>
)