
const getTitleProduct = async (params: any): Promise<string> => {
    const response = await fetch(`/api/products/get/${params}`);

    if(!response.ok) throw new Error('Ошибка при запросе')
    
    const data = await response.json();

    return data.title
}
export default getTitleProduct;