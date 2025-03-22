import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadState } from '@types-my/redux-type';


const initialState: UploadState = {
    uploadProgress: 0,
    selectedFiles: [],
    isAuth: false,
    userId: null,
    step: false,
    email: null,
    user_data: {
        email_: null,
        password_: null
    },
    currentPage: 1,
    totalPage: 1
};

const clientSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        setIsAuth (state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload
        },
        setUserId (state, action: PayloadAction<string>) {
            state.userId = action.payload
        },
        setUploadProgress: (state, action: PayloadAction<number>) => {
            state.uploadProgress = action.payload;
        },
        setSelectedFiles: (state, action: PayloadAction<File[]>) => {
            state.selectedFiles = action.payload;
        },
        clearSelectedFiles: (state) => {
            state.selectedFiles = [];
            state.uploadProgress = 0; 
        },
        setStep (state, action: PayloadAction<boolean>)  {
            state.step = action.payload
        },
        setUserData (state, action: PayloadAction<{email_:string, password_: string}>) {
            state.user_data.email_ = action.payload.email_;
            state.user_data.password_ = action.payload.password_
        },
        setCurrentPage (state, action:PayloadAction<number>) {
            state.currentPage = action.payload
        },
        setTotalPages (state, action: PayloadAction<number>) {
            state.totalPage = action.payload
        },
        setEmail (state, action: PayloadAction<string | null>) {
            state.email = action.payload
        }
    },
});

export const { setUploadProgress, setSelectedFiles, clearSelectedFiles, setIsAuth, setUserId, setStep, setUserData, setCurrentPage, setTotalPages, setEmail } = clientSlice.actions;

export default clientSlice.reducer;

