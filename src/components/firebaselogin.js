import React from 'react';
import {connect} from 'react-redux';

import './firebaselogin.css'

import { signin, signup } from '../store/actions/userActions';




class firebaselogin extends React.Component {
  constructor(props) {
     super(props);
 
     this.state = {
       email: "",
       password: "",
     };
   }
  setuser = (user) => {
      this.setState({email: user.target.value})
  }

  setpass = (pass) => {
      this.setState({password: pass.target.value})
  }
  createuser = () => {
      const user = {
          email: this.state.email,
          password: this.state.password
      }
      this.props.signup(user)
  }

  signinuser = () => {
      const user = {
          email: this.state.email,
          password: this.state.password
      }
      this.props.signin(user)
  }

  


  render() {
        return ( 
            <div className="logincenter">
                    <form >
                        <h3>Email</h3>
                        <input type="text" placeholder="Email" onChange={this.setuser}></input>

                        <h3>Password</h3>
                        <input type="password" placeholder="Password" onChange={this.setpass}></input>

                        <button className="button" onClick={this.signinuser} >Sign in</button>
                        <h3>Enter Email/Password Above and SignUp Instantly and Login</h3>
                        <button className="buttonsignup" onClick={this.createuser} >Sign Up</button>
                    </form>
            </div>
            
        )
    }
}



const mapStateToProps = (state) => {
    return {
        isloggedin: state.user.isloggedin,
    };
}

const mapDispatchToProps = dispatch => ({
    signin: user => dispatch(signin(user)),
    signup: user => dispatch(signup(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(firebaselogin);