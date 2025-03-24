import { FC, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Products } from '@types-my/query.type';
import { useParams } from 'react-router-dom';
import H from '@components/H';
import Dialog from '../components/Dialog';
import Slider from '../components/Slider';
import Cookies from 'js-cookie';
import Form from '../components/Form';
import { useDispatch, useSelector } from 'react-redux';
import { setIsShow } from '@slices-my/additionallySlice';
import { RootState } from 'store/store';

const RedactProduct:FC = () => {
  const isShow = useSelector((state: RootState) => state.additionally.isShow)

  const dispatch = useDispatch()
  const {id} = useParams()

  const [error, setError] = useState<string>('')
  const [name, setName] = useState<string>('Изменить параметры товара')

  const {data, isLoading, isError} = useQuery({
    queryKey: ['product-by-id'],
    queryFn: async ():Promise<Products> => {
      const res = await fetch(`/api/products/get-one-my/${id}`, {headers: {
        "Authorization": `Bearer ${Cookies.get('jwt')}`
      }})
      const data = await res.json();

      if(!res.ok) setError(data.message)

      return data.get_my_product
    }
  })
  useEffect(()=> {
   data?.title ? document.title = data?.title : document.title = 'Товар'
  }, [data])
  const showDialog = () => {
    dispatch(setIsShow(!isShow));
  }
  useEffect(()=> {
    !isShow ? setName('Изменить параметры товара') : setName("Закрыть окно")
  }, [isShow])
  return (
    <>
      <Dialog isHave={false} show={isShow} header='Изменить параметры товара'>
    {data && <Form title={data?.title} description={data.description} images={data.images} category={data.category} price={data.price} favicon={data.images[0]} />}
       </Dialog>
      {isLoading && !isError && <p className='loading'>Загрузка</p>}
      {isError && <p className='error'>{error}</p>}
    { data && !isError &&
      <div id='one_product'>
       <H>{data?.title}</H>
       <h2><span className='option'>Цена:</span>{`${data?.price}₽`}</h2>
       <h2><span className='option'>Категория:</span>{data?.category}</h2>
       <h2><span className='option'>Описание:</span>{data?.description}</h2>
       {!isShow && <span className='option'>Фотографии:</span>}
        {!isShow &&  <Slider data={data?.images} />}
        <button onClick={showDialog} id='redact' type="button">{name}</button>
    </div>
    }
    </>
    
  )
}

export default RedactProduct;