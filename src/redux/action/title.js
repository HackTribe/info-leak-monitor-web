import { SET_TITLE } from "../action/action_type";
export const setTitle = (value) => {
    document.title = value;
    return {type:SET_TITLE, data:value};
};
