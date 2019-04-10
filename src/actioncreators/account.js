import {AccountAction} from '../common/constants'

export const register = () => {
    return dispatch => {
        dispatch({
            type: AccountAction.Register
        })
    }
}