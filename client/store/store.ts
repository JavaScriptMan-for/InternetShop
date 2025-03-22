import {configureStore} from "@reduxjs/toolkit"
import clientSlice from "./slices/clientSlice";
import additionallySlice from "./slices/additionallySlice"
import {UploadState, AdditionallyState} from "@types-my/redux-type";
export interface RootState {
    client: UploadState;
    additionally: AdditionallyState
}
export default configureStore({
    reducer: {
        client: clientSlice,
        additionally: additionallySlice
    }
})