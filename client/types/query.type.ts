export interface Products {
    _id: string;
    title: string;
    description: string;
    favicon: string;
    price: number;
    category: string;
    images: string[]
}
export interface MyProducts extends Products {
    my_id: string
}
export interface Basket extends Products {
    my_id: string;
    count: number
}
export interface Categories {
    _id: string;
    name: string;
    __v: number
}
export interface UserData {
    message: string
    user: {
        userId: string;
        fullname: string;
        gender: 'man' | 'woman'
    }
}
export interface TypeInfoBasket {
    message: string;
    count: number;
    full_price: number
}
