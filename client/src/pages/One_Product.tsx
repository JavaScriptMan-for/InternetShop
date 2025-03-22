import { FC, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Products } from '@types-my/query.type';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Slider from '@components/Slider';
import Button from "@components/Add_basket_button"
import Cookies from 'js-cookie';
const Product:FC = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')
  const {id} = useParams()
  const hasItem = useQuery({
    queryKey: ['has-item'],
    queryFn: async () => {
      const res = await fetch(`/api/basket/has-item/${id}`, {
        headers: {
          "Authorization": `Bearer ${Cookies.get('jwt')}`
        }
      })
      const serverData = await res.json();

      if(!res.ok) {
        console.warn(serverData.message);
       throw new Error(serverData.message)
      }
        
      return serverData.isFind
    }
  })
  const {data, isLoading, isError} = useQuery({
    queryKey: ['product-by-id'],
    queryFn: async ():Promise<Products> => {
      const res = await fetch(`/api/products/get/${id}`)
      const data = await res.json();

      if(!res.ok) {
       setError(data.message)
      }
              

      return data.product
    }
  })

  useEffect(()=> {
   data?.title ? document.title = data?.title : document.title = 'Товар'
  }, [data])
  return (
    <>
      {isLoading && !isError && <p className='loading'>Загрузка</p>}
      {isError && <p className='error'>{error}</p>}
    { data && !isError &&
      <div id='one_product'>
       <h1>{data?.title}</h1>
       <h2><span className='option'>Цена:</span>{`${data?.price}₽`}</h2>
       <h2><span className='option'>Категория:</span>{data?.category}</h2>
       <h2><span className='option'>Описание:</span>{data?.description}</h2>
       <span className='option'>Фотографии:</span>
        <Slider data={data?.images} />
        { hasItem && !hasItem.isLoading && !hasItem.isError && !hasItem.data && <Button product_id={data._id}>Добавить в корзину</Button>}
        <h1>{hasItem.data}</h1>
        <Link onClick={() =>navigate(-1)} to="">Вернуться назад</Link>
    </div>
    }
    </>
    
  )
}

export default Product;