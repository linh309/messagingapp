import React from 'react';
import {connect} from 'react-redux';
import {accountRef, database} from "../config/firebase";
import {push} from 'connected-react-router';
import {AccountAction, FirebasePath} from '../common/constants';

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.onStartMessaging = this.onStartMessaging.bind(this);
    }

    onStartMessaging(e) {        
        const that = this;
        let userKeyTo = "";
        const friendList = [];        
        const convRef = database.ref(FirebasePath.conversations);

        //Get list of all current accounts
        accountRef.once("value", snapshot => {                    
            snapshot.forEach((item) => {                               
                const user = item.val(); 
                const userkey = item.key;                
                if (user !== null && that.props.userkey !== userkey ) {
                    friendList.push({
                        userkey: userkey, 
                        username: user.username,
                        avatar: user.avatarurl,
                        isLogin: user.isLogin!==undefined?user.isLogin:false
                    });                    
                    userKeyTo = userKeyTo === "" ? userkey : userKeyTo;
                }
            })

            //Update state
            that.props.dispatch({    
                type: AccountAction.StartMessaging,
                data: {
                    currentUser: {
                        friendList: friendList
                    },
                    currentMessaging: {
                        fromUserKey: that.props.userkey, //currently, current user is always the User sent message
                        toUserKey: userKeyTo
                    }
                }
            });

            //will trigger to select first friend in the list
            convRef.once("value", snapshot => {            
                const conversations = snapshot.val();
                if (conversations != null ) {
                    const convKeys = Object.keys(conversations);
                    let conversationKey = "";

                    convKeys.forEach((key) => {                        
                        const chatUsers = [that.props.userkey, userKeyTo];                       
                        const conversationData = conversations[key];
                        if (chatUsers.indexOf(conversationData.fromUserKey) >= 0 
                            && chatUsers.indexOf(conversationData.toUserKey) >= 0)
                        {
                            conversationKey = key
                        }                        
                    })

                    const existedConversationData = conversationKey !== "" ? conversations[conversationKey] : null;
                    const existedConversation = conversationKey === "" 
                                                    ? null
                                                    : {
                                                        conversationKey: conversationKey,
                                                        fromUserKey: existedConversationData.fromUserKey,
                                                        toUserKey: existedConversationData.toUserKey,
                                                        lastSentMessageDate: existedConversationData.lastSentMessageDate,      
                                                        messages: existedConversationData !== null && existedConversationData !== undefined 
                                                                        ? existedConversationData.messages 
                                                                        : null
                                                    };
                    that.props.dispatch({
                        type: "SELECTED_FRIEND",
                        data: 
                            {
                                currentMessaging: {
                                    fromUserKey: that.props.userkey,
                                    toUserKey: userKeyTo,
                                    conversationKey: conversationKey
                                },
                                conversation: existedConversation
                            }
                        }
                    )
                } else { 
                    //conversations == null
                    that.props.dispatch({
                        type: "SELECTED_FRIEND",
                        data: 
                            {
                                currentMessaging: {
                                    fromUserKey: that.props.userkey,
                                    toUserKey: userKeyTo,
                                    conversationKey: ""
                                },
                                conversation: null
                            }
                        }
                    )
                }
            })

            //Redirect to Message page
            that.props.dispatch(push('/Message'));            
        })
    }

    render() {
        return (
                <div className="jumbotron">
                    {this.props.username !== undefined && this.props.username !== ''
                        ? (
                            <div>
                                <img alt="avatar" src={this.props.avatar} />
                                <h2 className="display-4">Welcome {this.props.username}</h2>
                                <p className="lead">
                                    <button className="btn btn-primary btn-lg" onClick={this.onStartMessaging}>Start Messaging</button>
                                </p>
                            </div>
                        ) 
                        : (
                            <h2 className="display-4">Welcome Guest!</h2>
                        )
                    }
                </div>
        );
    }
}

const mapStateToProps = ({account}) => {    
    return {
        userkey: account.currentUser.userkey,
        username: account.currentUser.username,
        avatar: account.currentUser.avatar
    }    
}

export default connect(
    mapStateToProps,
    null
)(Welcome)