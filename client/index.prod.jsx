/*global user, authToken */
import React from 'react';
<<<<<<< HEAD
import {render} from 'react-dom';
import {Provider} from 'react-redux';
=======
import { render } from 'react-dom';
import Application from './Application.jsx';
import { Provider } from 'react-redux';
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
import configureStore from './configureStore';
import { navigate, login } from './actions';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
<<<<<<< HEAD
import Application from './Application.jsx';

import version from '../version.js';

Raven.config('https://23afae0ec2cf4b288fb0b26161ae00c3@sentry.io/289686', {
    ignoreErrors: ['/recaptcha/api2'],
=======
import Raven from 'raven-js';

import version from '../version.js';

const ravenOptions = {
    ignoreErrors: [
        // Random plugins/extensions
        'top.GLOBALS',
        // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error. html
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        'http://tt.epicplay.com',
        'Can\'t find variable: ZiteReader',
        'jigsaw is not defined',
        'ComboSearch is not defined',
        'http://loading.retry.widdit.com/',
        'atomicFindClose',
        // Facebook borked
        'fb_xd_fragment',
        // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
        // reduce this. (thanks @acdha)
        // See http://stackoverflow.com/questions/4113268
        'bmi_SafeAddOnload',
        'EBCallBackMessageReceived',
        // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
        'conduitPage',
        'YoukuAntiAds.eval'
    ],
    ignoreUrls: [
        // Facebook flakiness
        /graph\.facebook\.com/i,
        // Facebook blocked
        /connect\.facebook\.net\/en_US\/all\.js/i,
        // Woopra flakiness
        /eatdifferent\.com\.woopra-ns\.com/i,
        /static\.woopra\.com\/js\/woopra\.js/i,
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i,
        // Other plugins
        /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
        /webappstoolbarba\.texthelp\.com\//i,
        /metrics\.itunes\.apple\.com\.edgesuite\.net\//i
    ],
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    release: version
};

Raven.config('https://f5286cd580bf46898e7180c7a46de2f6@sentry.io/123019', ravenOptions)
    .install();

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search));

window.onpopstate = function(e) {
    store.dispatch(navigate(e.target.location.pathname));
};

if(typeof user !== 'undefined') {
    store.dispatch(login(user, authToken, user.admin));
}

render(
    <Provider store={ store }>
        <div className='body'>
            <ReduxToastr
                timeOut={ 4000 }
                newestOnTop
                preventDuplicates
                position='top-right'
                transitionIn='fadeIn'
                transitionOut='fadeOut' />
            <Application />
        </div>
    </Provider>, document.getElementById('component'));
