import { SET_TITLE } from "../action/action_type";

const setTitle = (state='', action) => {
    const {type, data} = action;
    let newState;
    switch (type) {
        case SET_TITLE:
            newState = data;
            break;
    
        default:
            newState = state;
            break;
    }
    return newState;
};
export default setTitle;
