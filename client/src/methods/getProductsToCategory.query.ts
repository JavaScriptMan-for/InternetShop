import { Products } from "../../types/query.type";
const getProductsByCategory = async (category: string | undefined):Promise<Products[] | undefined> => {
    if(!category) return undefined
    const response = await fetch(`/api/products/get-products/${category}`)

    if(!response.ok) throw new Error('Ошибка сервера')

    const data = await response.json();

    return data;
}
export default getProductsByCategory;