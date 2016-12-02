'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.jsx'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers/folderReducer'

let store = createStore(reducer)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'));
