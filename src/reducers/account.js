//reducer/account
import {initialState} from '../common/initialState';
import {AccountAction} from '../common/constants';
import {accountRef} from "../config/firebase";

export default (state = initialState, action) => {
    switch (action.type) {
        case AccountAction.Register:
            return Object.assign(
                {}, 
                state, 
                action.data);

        case AccountAction.StartMessaging:
            const newState = Object.assign(
                {},
                state, 
                {
                    currentUser: Object.assign({}, {...state.currentUser}, {...action.data.currentUser}),
                    currentMessaging: Object.assign({}, {...state.currentMessaging}, {...action.data.currentMessaging})
                }
            );
            
            return newState;

        case AccountAction.Login:
            //User is current logged so just need to update against to database
            const userRef = accountRef.child(action.data.currentUser.userkey);
            userRef.update({
                isLogin: true,
                lastLogin: new Date()
            });
            const refreshState = Object.assign({}, initialState, state);

            const loginState = Object.assign(
                {}, 
                refreshState, 
                {
                    currentUser: Object.assign({}, state.currentUser, action.data.currentUser)
                });

            return loginState;
        
        case AccountAction.InitializeMessage:        
            const currentState =  Object.assign(
                {}, 
                state, 
                {
                    conversations: action.data.conversations,
                    currentMessaging: Object.assign({}, state.currentMessaging, action.data.currentMessaging)
                }
            );

            //Currently, always get fetching data by UserFromKey with current user
            return currentState;
        
        case AccountAction.SendMessage:
            const conversations = [];

            if (action.data.conversation !== null) {
                conversations.push(action.data.conversation);
            }

            if (state.conversations !== undefined && state.conversations !== null && state.conversations.length >= 0) {
                state.conversations.map((conv) => {
                    if (conv.conversationKey !== action.data.conversation.conversationKey) {
                        conversations.push(conv)
                    }                     
                });
            }

            const currentMessaging = Object.assign(
                                        {},
                                        {...state.currentMessaging}, 
                                        {
                                            conversationKey: action.data.conversation.conversationKey                    
                                        });
                                        
            let stateConversation =  Object.assign(
                {},
                state, 
                {
                    currentMessaging: currentMessaging,
                    conversations: conversations                    
                });

            return stateConversation;    
            
        case "SELECTED_FRIEND":    
            debugger;
            let updatedConversation = [];
            if (action.data.conversation != null) {
                updatedConversation.push(action.data.conversation)
            }

            if (state.conversations !== null) {
                state.conversations.map((conv) => {
                    if (action.data.conversation === null 
                        || action.data.conversation.conversationKey === "" 
                        || conv.conversationKey !== action.data.conversation.conversationKey) {
                        updatedConversation.push(conv);
                    }
                })
            }

            const newSeletedState =  Object.assign(
                {},
                state, 
                {
                    currentMessaging: action.data.currentMessaging,
                    conversations: updatedConversation                    
                });

        
            return newSeletedState;

        default:
            return state;
    }
};