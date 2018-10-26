import { createStore } from "redux";
import { registerReducer } from "./registerReducer";

const store  = createStore(registerReducer, { registers: (new Array(32)).fill(Math.floor(0)) }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;