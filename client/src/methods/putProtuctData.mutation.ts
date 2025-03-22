import { NewProduct } from "@types-my/form.type"
import Cookies from "js-cookie"
const putProductFn = async (data:NewProduct, selectedFiles: File[], id: string | undefined):Promise<string | undefined>=> {
    const formData = new FormData();

    // Добавляем файлы
    if (selectedFiles && selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('images', selectedFiles[i]);
        }
    }

    // Добавляем текстовые данные
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.price) formData.append('price', String(data.price));
    if (data.category) formData.append('category', data.category);

    // Выводим содержимое FormData для отладки
    console.log("Содержимое FormData:");
    for (const entry of formData.entries()) {
        console.log(entry);
    }

    const res = await fetch(`/api/products/put/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
            "Authorization": `Bearer ${Cookies.get('jwt')}`
        }
    });

    const serverData = await res.json();

    //  Более точная проверка на отсутствие изменений (проверяем, что хоть что-то было отправлено)
    if (
        !data.title &&
        !data.description &&
        (!selectedFiles || selectedFiles.length === 0) &&
        !data.category &&
        !data.price
    ) {
        throw new Error("Вы ничего не изменили");
    }

    if (!res.ok) throw new Error(serverData.message || 'Произошла ошибка');

    return serverData.message;
}
export default putProductFn