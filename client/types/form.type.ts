export interface NewProduct {
    title: string;
    description: string;
    images: File[];
    category: string;
    price: number
}
export interface User {
    email: string;
    password: string;
    password_verify: string;
    fullname: string;
    gender: 'man' | 'woman'
}
export interface IVerify {
    clientCode: number
}
export interface Email  {
    email: string
}
export interface IFagotPassword {
    email?: string;
    code_verify: number;
    newPassword: string;
    verify_password?: string
}