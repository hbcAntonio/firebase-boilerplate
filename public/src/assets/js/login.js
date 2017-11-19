'use strict';
import $ from 'jquery';
import * as firebase from 'firebase';
import { 
    createCookie, 
    eraseCookie 
} from './util';

let currentUser;

const redirect = () => {
    $('#sign-in').addClass('disabled');
	document.location.replace('/');
};

const logout = () => {
    currentUser = undefined;
    eraseCookie('__session');
    $('#sign-in').removeClass('disabled');
    $('#spinner').addClass('hidden');
    return firebase.auth().signOut();
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

const auth = () => {
    $('#sign-in').click(e => login(e));
    const session = {};

    firebase.auth().getRedirectResult().then(function(result) {
		currentUser = firebase.auth().currentUser;
        console.log('currentUser', currentUser);
        if(result.credential) {
            $('#spinner').removeClass('hidden');
            session['__f4wtoken_pre'] = result.credential.idToken;
            session['__fxwtoken'] = result.credential.accessToken;
        }
        
        // If no user is logged in, make sure
        // new user is able to login through provider
        if (currentUser === null) {
            logout();
            return;
        } else if (currentUser) {
			currentUser.getToken(true)
			.then(idToken => {
                session['__f4wtoken_tsa'] = idToken;
                createCookie('__session', JSON.stringify(session), 1);
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


export default auth;