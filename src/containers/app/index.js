//container/app/index.js
//1. Navigation Header
//2. Containing component need to be rendered

import React from 'react';
import {Route, Link, Redirect } from 'react-router-dom';
import Home from '../home';
import Register from '../../components/register';
import Welcome from '../../components/Welcome';
import Login from '../../components/login';
import Message from '../../components/message';
import {connect} from 'react-redux';

const Header = (props) => {
    return (
        <div className="row">
            <div className="col-sm-12">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <b className="navbar-brand">Message</b>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">                                
                                <Link className="nav-link" to='/'>Home</Link>
                            </li>
                            <li className="nav-item">                                
                                <Link className="nav-link" to='/Login'>Login</Link>
                            </li>
                            <li className="nav-item">                                                                
                                <Link className="nav-link" to='/register'>Register</Link>
                            </li>
                        </ul>
                        <div className="my-2 my-lg-0">                        
                            { props.username !== "" 
                                ? <span>
                                    Hello <b>{props.username}</b>
                                </span> 
                                : null }
                        </div>                        
                    </div>
                </nav>
            </div>
        </div>    
    );
}


const App = (props) => (
    <div className="container">
        <Header username = {props.username} />
        <div className="row">
            <main className="col-sm-12">
                <Route exact path="/" component = {Home} />
                <Route exact path = '/register' component={Register} />
                <Route exact path = '/Welcome' component={Welcome} />
                <Route exact path = '/Login' component={Login} />
                <Route exact path = '/message' component={Message} /> 
            </main>
        </div>   
    </div>   
)

const mapStateToProps = ({account}) => {
    return {        
        username: account.currentUser.username
    }
};

export default connect(
    mapStateToProps,
    null)
(App);