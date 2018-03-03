/*global user, authToken */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
<<<<<<< HEAD
import {navigate, login} from './actions';
=======
import { navigate, login } from './actions';
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
import { AppContainer } from 'react-hot-loader';
import DevTools from './DevTools';

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search));

window.onpopstate = function(e) {
    store.dispatch(navigate(e.target.location.pathname));
};

if(typeof user !== 'undefined') {
    store.dispatch(login(user, authToken, user.admin));
}

const render = () => {
    const Application = require('./Application.jsx').default;
    ReactDOM.render(<AppContainer>
        <Provider store={ store }>
            <div className='body'>
                <ReduxToastr
                    timeOut={ 4000 }
                    newestOnTop
                    preventDuplicates
                    position='top-right'
                    transitionIn='fadeIn'
<<<<<<< HEAD
                    transitionOut='fadeOut'/>
=======
                    transitionOut='fadeOut' />
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                <Application />
            </div>
        </Provider>
    </AppContainer>, document.getElementById('component'));
};

if(module.hot) {
    module.hot.accept('./Application.jsx', () => {
        setTimeout(render);
    });
}

render();
