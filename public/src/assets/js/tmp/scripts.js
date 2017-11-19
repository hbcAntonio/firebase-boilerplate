'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _popper = require('popper');

var _popper2 = _interopRequireDefault(_popper);

var _bootstrap = require('bootstrap');

var _bootstrap2 = _interopRequireDefault(_bootstrap);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _firebase = require('firebase');

var firebase = _interopRequireWildcard(_firebase);

var _config = require('./config');

var config = _interopRequireWildcard(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paths = {
  '/login': _login2.default
};

(function ($, window, document, undefined) {

  $(function () {
    //DOM ready, take it away
    console.log('DOM ready, take it away');

    window.popper = _popper2.default;
    window.bootstrap = _bootstrap2.default;

    try {
      firebase.initializeApp(config.firebaseConfig);
      console.log('Firebase project loaded!');
    } catch (err) {
      console.warn('Unable to load firebase project!');
      console.error(err);
    }

    var path = window.location.pathname;
    paths[path]();
  });
})(_jquery2.default, window, document);