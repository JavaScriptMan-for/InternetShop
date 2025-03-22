
export interface UploadState {
    email: null | string;
    uploadProgress: number;
    selectedFiles: File[];
    isAuth: boolean;
    userId: string | null;
    step: boolean;
    user_data: {
        email_: string | null;
        password_: string | null
    };
    currentPage: number;
    totalPage: number
}
export interface AdditionallyState {
    isShow: boolean;
    isOpen: boolean;
    isSend: boolean;
    updateCount: number
}