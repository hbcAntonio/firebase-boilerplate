'use strict';
import $ from 'jquery';
import popper from 'popper';
import bootstrap from 'bootstrap';
import login from './login';
import * as firebase from 'firebase';
import * as config from './config';

const paths = {
  '/login': login
};

(function ($, window, document, undefined) {

  $(function () {
    //DOM ready, take it away
    console.log('DOM ready, take it away');

    window.popper = popper;
    window.bootstrap = bootstrap;

    try {
      firebase.initializeApp(config.firebaseConfig);
      console.log('Firebase project loaded!');
    } catch (err) {
      console.warn('Unable to load firebase project!');
      console.error(err);
    }

    const path = window.location.pathname;
    paths[path]();
  });

})($, window, document);
