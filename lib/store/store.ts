import {combineReducers, configureStore, Reducer} from "@reduxjs/toolkit";
import {AppStateSchema} from "./types";
import {sessionReducer} from "./Session/model/slice";

export const appReducers: Reducer<AppStateSchema> = combineReducers({
    sessionReducer,
});

const store = configureStore({
    reducer: appReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;