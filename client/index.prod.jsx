/*global user, authToken, Raven */
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './configureStore';
import {navigate, login} from './actions';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
import Application from './Application.jsx';

import version from '../version.js';

Raven.config('https://23afae0ec2cf4b288fb0b26161ae00c3@sentry.io/289686', {
    ignoreErrors: ['/recaptcha/api2'],
    release: version
}).install();

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search));

window.onpopstate = function(e) {
    store.dispatch(navigate(e.target.location.pathname));
};

if(typeof user !== 'undefined') {
    store.dispatch(login(user, authToken, user.admin));
}

render(
    <Provider store={store}>
        <div>
            <ReduxToastr
                timeOut={4000}
                newestOnTop
                preventDuplicates
                position='top-right'
                transitionIn='fadeIn'
                transitionOut='fadeOut'/>
            <Application />
        </div>
    </Provider>, document.getElementById('component'));
