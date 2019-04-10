export const initialState = {
    currentUser: {
        userkey: '',
        username: '',
        avatar: '',
        isLogin: false,
        lastLogin: null,
        friendList: []
    },
    currentMessaging: {
        fromUserKey: "",
        toUserKey: "",
        conversationKey: ""
    },
    conversations: []
};
