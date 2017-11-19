'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _firebase = require('firebase');

var firebase = _interopRequireWildcard(_firebase);

var _util = require('./util');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentUser = undefined;

var auth = function auth() {
    (0, _jquery2.default)('#sign-in').click(function (e) {
        return login(e);
    });

    firebase.auth().getRedirectResult().then(function (result) {
        currentUser = firebase.auth().currentUser;
        console.log('currentUser', currentUser);
        if (result.credential) {
            (0, _jquery2.default)('#spinner').removeClass('hidden');
            (0, _util.createCookie)('__f4wtoken_pre', result.credential.idToken, 1);
            (0, _util.createCookie)('__fxwtoken', result.credential.accessToken, 1);
        }

        // If no user is logged in, make sure
        // new user is able to login through provider
        if (currentUser === null) {
            logout();
            return;
        } else if (currentUser) {
            currentUser.getToken(true).then(function (idToken) {
                (0, _util.createCookie)('__f4wtoken_tsa', idToken, 1);
                console.log('Cookie created and user updated');
                console.log(currentUser);
                redirect();
            }).catch(function (err) {
                return console.error(err);
            });
        }
    }).catch(function (error) {
        console.error(error);
    });
};

var login = function login() {
    (0, _jquery2.default)('#spinner').removeClass('hidden');

    if (!currentUser) {
        console.log('No user has logged in');
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ hd: 'poweredbysearch.com' });

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () {
            console.log('Setting persistence to LOCAL');
            return firebase.auth().signInWithRedirect(provider);
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(errorCode + ' ' + errorMessage);
            (0, _jquery2.default)('#spinner').addClass('hidden');
        });
    } else {
        console.log('Logging out...');
        logout().then(function () {
            return console.log('Logged out!');
        }).catch(function (err) {
            return console.error(err);
        });
    }
};

var logout = function logout() {
    currentUser = undefined;
    (0, _util.eraseCookie)('__f4wtoken_pre');
    (0, _util.eraseCookie)('__f4wtoken_tsa');
    (0, _util.eraseCookie)('__fxwtoken');
    (0, _jquery2.default)('#sign-in').removeClass('disabled');
    (0, _jquery2.default)('#spinner').addClass('hidden');
    return firebase.auth().signOut();
};

var redirect = function redirect() {
    (0, _jquery2.default)('#sign-in').addClass('disabled');
    document.location.replace('/');
};

exports.default = auth;