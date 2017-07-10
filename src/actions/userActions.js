import firebase from 'firebase';



export const signup = ({email, password}) => dispatch => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/weak-password') {
            alert('The password is too weak.');
            } else {
            alert(errorMessage);
            }})
      .then(user => {
          if(user!= null){
        dispatch({type: "SET_ISLOGGEDIN", payload: true})}
      });
};

export const signin = ({email, password}) => dispatch => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/weak-password') {
            alert('The password is too weak.');
            } else {
            alert(errorMessage);
            }})
    .then(user => {
          if(user!= null){
        dispatch({type: "SET_ISLOGGEDIN", payload: true})}
      });
};

export const addmarker = ({lat, lng}) => dispatch => {
    const user = firebase.auth().currentUser;
    if (user != null) {
        firebase.database().ref('users').child(user.uid).child('markers').push({
            'latitude': lat,
            'longitude': lng
        })
    }
};


export const refresh = () => dispatch => {
    firebase.auth().onAuthStateChanged(user => {
       if (user != null) {
            dispatch({type: "SET_ISLOGGEDIN", payload: true})
            
            firebase.database().ref('users').child(user.uid).child('markers').on('value', snap =>{
                
                if (snap.val()) {
                    let marks = snap.val();
                    let markerlist = [];
                    for (let mark in marks) {
                        markerlist.push({
                            id: mark,
                            latitude: marks[mark].latitude,
                            longitude: marks[mark].longitude,
                        })
                        dispatch({type: "SET_MARKERS", payload: markerlist})
                    }
                } else {
                } 
            });
        } else {
            dispatch({type: "SET_ISLOGGEDIN", payload: false})
        }
    })
}


