import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { CollApsedReducer } from "./reducer/CollapsedReducer";
import { LoadingReducer } from "./reducer/LoadingReducer";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "kerwin",
  storage,
  blacklist: ["LoadingReducer"],
};
const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer,
});
// const persistedReducer = persistReducer(persistConfig, reducer);
// console.log(persistedReducer);
const store = configureStore({ reducer });
const persistor = persistStore(store);
export { store, persistor };

/*
 store.dispatch()

 store.subsribe()

*/
