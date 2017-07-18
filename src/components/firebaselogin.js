import React from 'react';
import firebase from 'firebase';

import './firebaselogin.css'

import Popicon from 'material-ui/svg-icons/action/announcement'
import Usericon from 'material-ui/svg-icons/action/account-box'
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';

export default class firebaselogin extends React.Component {
  constructor(props) {
     super(props);
 
     this.state = {
       email: "",
       password: ""
     };
   }
  setuser = (user) => {
      this.setState({email: user.target.value})
  }

  setpass = (pass) => {
      this.setState({password: pass.target.value}) 
  }
  createuser = () => {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);})
      
  }

  signinuser = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            })
      
  }
  signout = () => {
    firebase.auth().signOut();
 
  }


  render() {
        return ( 
            <div className="logincenter">
                { this.props.isloggedin ? (
                <div>
                    <List>
                        <ListItem
                            disabled={true}
                            leftIcon={<Usericon />}
                        >
                            {this.props.userid}
                        </ListItem>
                        <ListItem
                            disabled={true}
                            leftIcon={<Popicon />}
                        >
                            {this.props.markers.length} Bubbles/Leafs/Markers
                        </ListItem>
                        <button className="buttonsignup" onClick={this.signout} >Sign Out</button>
                    </List>
                </div>
                ) : (<div>
                    
                    
                        <h3>Email</h3>
                        <input type="text" placeholder="Email" onChange={this.setuser}></input>
                        
                        <h3>Password</h3>
                        <input type="password" placeholder="Password" onChange={this.setpass}></input>

                        <button className="button" onClick={this.signinuser} >Sign in</button>
                        <h3>Enter Email/Password Above and SignUp Instantly and Login</h3>
                        <button className="buttonsignup" onClick={this.createuser} >Sign Up</button>
                        
                   
                </div> )}
            </div>
            
        )
    }
}


