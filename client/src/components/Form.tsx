import { FC } from 'react';
import { useMutation } from '@tanstack/react-query'
import { useForm } from "react-hook-form"
import { NewProduct } from '@types-my/form.type';
import uploadImages from "/img/upload.png"
import { Link } from 'react-router-dom';
import putProductFn from '@methods/putProtuctData.mutation';
import { setUploadProgress, setSelectedFiles } from "../../store/slices/clientSlice"
import { setIsShow } from '@slices-my/additionallySlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "store/store";
import { useParams } from 'react-router-dom';

interface FormProps {
    title: string;
    description: string;
    favicon: string;
    price: number;
    category: string;
    images: string[];
}

const Form:FC<FormProps> = ({title, description, price, category}) => {
    const {id} = useParams()
  const selectedFiles = useSelector((state: RootState) => state.client.selectedFiles)
  const dispatch = useDispatch()
  const {handleSubmit, register, formState: {
  },
  reset,
  setValue
} = useForm<NewProduct>({
  mode: 'onBlur'
})
const mutation = useMutation({
  mutationKey: ['redact-product'],
  mutationFn: async (data: NewProduct) => {
    return await putProductFn(data, selectedFiles, id);
  },
  onSuccess: () => {
    reset()
    dispatch(setSelectedFiles([])); // Очищаем выбранные файлы
    dispatch(setUploadProgress(0)); // Сбрасываем прогресс
    document.location.reload();
},
onError: (error: any) => {
    console.error("Mutation error:", error);
},
})
const onSubmit = (data: NewProduct) => {
  mutation.mutate(data);
  console.log(data)
}
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files) {
      const files = Array.from(event.target.files);
      dispatch(setSelectedFiles(files));
      setValue('images', files);
  }
};
const showDialog = () => {
  dispatch(setIsShow(false))
}
  return (
    <form onSubmit={handleSubmit(onSubmit)} id='add-product'>
      <label htmlFor="title-input">Заголовок:</label>
      <input
      placeholder={title}
      id='title-input'
      type="text"
      {...register('title')}
      />
      <label htmlFor="description-input">Описание товара:</label>
      <textarea
       {...register('description')}
        id="description-input"
        placeholder={description}
        >
        </textarea>
        <label htmlFor="price-input">Цена:</label>
        <input
        id='price-input'
        {...register('price')}
         type="number"
         placeholder={`${price}₽`}
          />
          <label htmlFor="category-input">Категория:</label>
          <input
            type="text"
            id="category-input"
            placeholder={category}
            {...register('category')}
             />
             <label id='photos' htmlFor="images-input">
              <img src={uploadImages} alt="Загрузить" />

              </label>
             <input
               id='images-input'
              onChange={handleFileChange}
              type="file"
              multiple
               />
      <button type="submit">Создать</button>
      <Link onClick={showDialog} to="">Закрыть окно</Link>
      {mutation.isPending && <p className='loading'>Загрузка...</p>}
      {mutation.isError && <p className='error'>{mutation.error?.message || 'Произошла ошибка'}</p>}
      {!mutation.isError && !mutation.isPending && mutation.data && <p className='success'>Параметры товара успешно изменены</p>}
    </form>
  )
}

export default Form;