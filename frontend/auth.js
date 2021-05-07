firebase.auth().languageCode = 'it';
let ui = new firebaseui.auth.AuthUI(firebase.auth());

const database = firebase.database();

let googleProvider = new firebase.auth.GoogleAuthProvider();
let facebookProvider = firebase.auth.GithubAuthProvider.PROVIDER_ID;

var uiConfig = {
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,
    ],
};

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let uid = user.uid;
      window.user = user;
      window.location = 'home.html';
      let dref = database.ref('/users/'+uid);
      if(dref === null){
          dref.set({
            "light-theme": true,
            "puzzles": {
              "empty": true
            }
          });
      }
    } else {
      // No user is signed in.
    }
  });


  firebase.auth()
  .getRedirectResult()
  .then((result) => {
    if (result.credential) {
      /** @type {firebase.auth.OAuthCredential} */
      let credential = result.credential;
      // This gives you a Google Access Token. You can use it to access the Google API.
      let token = credential.accessToken;
      // ...
    }
    // The signed-in user info.
    let user = result.user;
  }).catch((error) => {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    // The email of the user's account used.
    let email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    let credential = error.credential;
    // ...
  });

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {
    return ui.start('#firebaseui-auth-container', uiConfig);
  })