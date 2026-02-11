import {SessionSchema} from "./Session/model/types";
import store from "./store";

export type AppDispatch = typeof store.dispatch;

export interface AppStateSchema {
    sessionReducer: SessionSchema;
}