'use strict';
import $ from 'jquery';
import * as firebase from 'firebase';
import { 
    createCookie, 
    readCookie,
    eraseCookie 
} from './util';

let currentUser = undefined;

const auth = () => {
    $('#sign-in').click(e => login(e));
  
    firebase.auth().getRedirectResult().then(function(result) {
		currentUser = firebase.auth().currentUser;
        console.log('currentUser', currentUser);
        if(result.credential) {
            $('#spinner').removeClass('hidden');
            createCookie('__f4wtoken_pre', result.credential.idToken, 1);
            createCookie('__fxwtoken', result.credential.accessToken, 1);
        }
        
        // If no user is logged in, make sure
        // new user is able to login through provider
        if (currentUser === null) {
            logout();
            return;
        } else if (currentUser) {
			currentUser.getToken(true)
			.then(idToken => {
                createCookie('__f4wtoken_tsa', idToken, 1);
				console.log('Cookie created and user updated');
				console.log(currentUser);
				redirect();
			})
			.catch(err => console.error(err));
		}
    }).catch(function(error) {
        console.error(error);
    });
};

const login = () => {
    $('#spinner').removeClass('hidden');

    if (!currentUser) {
        console.log('No user has logged in');
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ hd: 'poweredbysearch.com' });
  
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
          console.log('Setting persistence to LOCAL');
          return firebase.auth().signInWithRedirect(provider);
        })
        .catch(function(error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(`${errorCode} ${errorMessage}`);
          $('#spinner').addClass('hidden');
        });
    } else {
        console.log('Logging out...');
        logout().then(() => console.log('Logged out!')).catch(err => console.error(err));
    }
};

const logout = () => {
    currentUser = undefined;
    eraseCookie('__f4wtoken_pre');
    eraseCookie('__f4wtoken_tsa');
    eraseCookie('__fxwtoken');
    $('#sign-in').removeClass('disabled');
    $('#spinner').addClass('hidden');
    return firebase.auth().signOut();
};

const redirect = () => {
    $('#sign-in').addClass('disabled');
	document.location.replace('/');
};

export default auth;