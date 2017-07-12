import React from 'react';
import { Link } from 'react-router-dom'
import firebase from 'firebase';

import './firebaselogin.css'




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
      .then(user =>{
      this.setState({uinfo: user.uid})
    });
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
      .then(user =>{
      this.setState({uinfo: user})
    });
  }
  signout = () => {
    firebase.auth().signOut();
 
  }
  


  render() {
        return ( 
            <div className="logincenter">
                { this.props.isloggedin ? (
                <div>
                    <Link to="/"><button className="buttonsignup" onClick={this.signout} >Sign Out</button></Link>
                </div>
                ) : (<div>
                    
                    <form >
                        <h3>Email</h3>
                        <input type="text" placeholder="Email" onChange={this.setuser}></input>

                        <h3>Password</h3>
                        <input type="password" placeholder="Password" onChange={this.setpass}></input>

                        <Link to="/"><button className="button" onClick={this.signinuser} >Sign in</button></Link>
                        <h3>Enter Email/Password Above and SignUp Instantly and Login</h3>
                        <Link to="/"><button className="buttonsignup" onClick={this.createuser} >Sign Up</button></Link>
                        
                    </form>
                </div> )}
            </div>
            
        )
    }
}


