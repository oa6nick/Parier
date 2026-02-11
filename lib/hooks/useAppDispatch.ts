import {useDispatch} from "react-redux";

import type {AppDispatch} from "@/lib/store/types";

export const useAppDispatch = () => useDispatch<AppDispatch>();
