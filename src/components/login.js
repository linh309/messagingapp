import React from 'react';
import {accountRef} from "../config/firebase";
import {connect} from 'react-redux';
import {push} from 'connected-react-router';
import {AccountAction} from '../common/constants';

class Login extends React.Component {
    constructor(props) {
        super(props);   
        this.onLogin = this.onLogin.bind(this);
    }

    onLogin(e) {
        const that = this;
        const username = this.username.value;
        const password = this.password.value;

        accountRef
            .orderByChild("username")
            .equalTo(username)
            .once('value', (snapshot) => {
                const data = snapshot.val();
                const isExisted = data !== null;

                if (isExisted) {
                    snapshot.forEach((userData)=> {
                        const userkey = userData.key;
                        const user = userData.val();
                        if (user.username === username && user.password === password)
                        {
                            that.props.dispatch
                            ({
                                type: AccountAction.Login,
                                data: {
                                    currentUser: {
                                        userkey: userkey,
                                        username: user.username,
                                        avatar: user.avatarurl,
                                        isLogin: true
                                }}
                            }) 
    
                            that.props.dispatch(push('/Welcome'));
                        }
                        else {                            
                            alert("Wrong user name or password");                            
                        }
                    })
                } else {
                    alert("Wrong user name or password");
                }
            })

        e.preventDefault();

    }

    render() {
        return (
            <div className="row justify-content-center align-items-center">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={this.onLogin} autoComplete="off">
                                <div className="form-group">
                                    <input type="text" className="form-control" name="username" ref={(input) => this.username = input} />
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" name="password" ref={(input) => this.password = input}/>
                                </div>
                                <button type="submit" id="sendlogin" className="btn btn-primary">login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    null,
    null
)(Login)

