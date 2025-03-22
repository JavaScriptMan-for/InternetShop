import { FC, useState } from 'react';
import { useMutation } from '@tanstack/react-query'
import { useForm } from "react-hook-form"
import { NewProduct } from '@types-my/form.type';
import uploadImages from "/img/upload.png"
import addProductFn from '@methods/mutation-add';
import { setUploadProgress, setSelectedFiles } from "../../store/slices/clientSlice"
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "store/store";
const Add_product:FC = () => {
  const [isFile, setIsFile] = useState<boolean>(false)
  const selectedFiles = useSelector((state: RootState) => state.client.selectedFiles)
  const dispatch = useDispatch()
  const {handleSubmit, register, formState: {
    isValid,
    errors
  },
  reset,
  setValue
} = useForm<NewProduct>({
  mode: 'onBlur'
})
const mutation = useMutation({
  mutationKey: ['add-product'],
  mutationFn: async (data: NewProduct) => {
    return await addProductFn(data, selectedFiles);
  },
  onSuccess: () => {
    reset()
    dispatch(setSelectedFiles([])); // Очищаем выбранные файлы
    dispatch(setUploadProgress(0)); // Сбрасываем прогресс
},
onError: (error: any) => {
    console.error("Mutation error:", error);
},
})
const onSubmit = (data: NewProduct) => {
  mutation.mutate(data);
}
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files) {
      const files = Array.from(event.target.files);
      dispatch(setSelectedFiles(files));
      setValue('images', files);
      console.log(files.length)
      if(files.length === 0 || files.length < 10) {
        setIsFile(true)
      } else {
        setIsFile(false)
      }
  }
};
  return (
    <form onSubmit={handleSubmit(onSubmit)} id='add-product'>
      <label htmlFor="title-input">Заголовок:</label>
      {errors.title && <p className='validation-error'>{errors.title.message}</p>}
      <input
      placeholder='Название'
      id='title-input'
      type="text"
      {...register('title', {
        required: "Это поле не может быть пустым",
        minLength: {
          value: 4,
          message: "Это поле должно содержать минимум 4 символа"
        }
      })}
      />
      <label htmlFor="description-input">Описание товара:</label>
      {errors.description && <p className="validation-error">{errors.description.message}</p>}
      <textarea
       {...register('description', {
        required: "Это поле не может быть пустым",
          minLength: {
            value: 10,
            message: "Минимальное количество символов - 10"
          },
          maxLength: {
            value: 1000,
            message: "Максимально количество символов - 1000"
          }
       })}
        id="description-input"
        placeholder='Описание товара'
        >
        </textarea>
        <label htmlFor="price-input">Цена:</label>
        {errors.price && <p className="validation-error">{errors.price.message}</p>}
        <input
        id='price-input'
        {...register('price', {
          required: "Это поле не может быть пустым"
        })}
         type="number"
         placeholder='Цена в рублях'
          />
          <label htmlFor="category-input">Категория:</label>
          {errors.category && <p className='validation-error'>{errors.category.message}</p>}
          <input
            type="text"
            id="category-input"
            placeholder='Категория'
            {...register('category', {
              required: "Это поле не может быть пустым",
              minLength: {
                value: 3,
                message: "Минимальное количество символов - 3"
              },
              maxLength: {
                value: 10,
                message: "Максимальное количество символов - 10"
              },
            })}
             />
             <label id='photos' htmlFor="images-input">
              <img src={uploadImages} alt="Загрузить" />

              </label>
              {errors.images && <p className='validation-error'>{errors.images.message}</p>}
             <input
               id='images-input'
              onChange={handleFileChange}
              type="file"
              multiple
               />
      <button disabled={!isFile || !isValid} type="submit">Создать</button>
      {mutation.isPending && <p className='loading'>Загрузка...</p>}
      {mutation.isError && <p className='error'>{mutation.error?.message || 'Произошла ошибка'}</p>}
      {!mutation.isError && !mutation.isPending && mutation.data && <p className='success'>Товар успешно создан</p>}
    </form>
  )
}

export default Add_product;