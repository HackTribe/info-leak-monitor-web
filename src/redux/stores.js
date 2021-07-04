import { createStore } from "redux"
import Reducers from "./reducer/index"
// import thunk from "react-thunk"

// export default createStore(Reducer,{},applyMiddleware(thunk))
export default createStore(Reducers)