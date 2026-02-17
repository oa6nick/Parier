import {InternalHandlersProfileResponse} from "@/api/client/api";

export interface SessionSchema {
  session?: InternalHandlersProfileResponse;
  isAuthenticated: boolean;
}
