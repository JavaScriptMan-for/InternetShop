import {Categories} from "../../types/query.type"

const getCategories = async ():Promise<Categories[]> => {
    const response = await fetch('/api/products/categories');

    if(!response.ok) throw new Error("Ошибка сервера")

    const data = await response.json();
    return data.categories
}
export default getCategories