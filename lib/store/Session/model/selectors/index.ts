import type {AppStateSchema} from "@/lib/store/types";

export const getSessionIsAuthenticated = (state: AppStateSchema) => state.sessionReducer.isAuthenticated;
export const getSession = (state: AppStateSchema) => state.sessionReducer.session;
