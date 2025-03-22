import { NewProduct } from "@types-my/form.type";
import Cookies from "js-cookie";


const addProductFn = async (data:NewProduct, selectedFiles: File[]):Promise<string | undefined>=> {
    try {
        const jwt:string | undefined = Cookies.get('jwt') || ''
        if(!jwt || jwt === '' ) throw new Error('Пользователь не зарегистрирован')
        const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i]); // Отправляем каждый файл по отдельности
    }
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', String(data.price)); // Преобразуем в строку
    formData.append('category', data.category);

    const res = await fetch('/api/products/add', {
        method: 'POST',
        body: formData,
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    const d = await res.json();
    if (!res.ok) throw new Error(d.message);

    return d.message;

    } catch (error) {
        throw new Error(String(error))
    }
    
}
export default addProductFn