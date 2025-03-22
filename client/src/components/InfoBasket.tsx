import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { TypeInfoBasket } from '@types-my/query.type';
import { RootState } from 'store/store';


const InfoBasket:FC = () => {
const updateCount = useSelector((state: RootState) => state.additionally.updateCount)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['get-info'],
    queryFn: async ():Promise<TypeInfoBasket> => {
      const res = await fetch('/api/basket/get-info', {headers: {
        "Authorization": `Bearer ${Cookies.get('jwt')}`
      }})
      const serverData:TypeInfoBasket = await res.json();

      if(!res.ok) throw new Error(serverData.message);

      return serverData
    }
  })
  useEffect(()=> {
    refetch()
  }, [updateCount])
  return (
    <div id='basket-info'>
     <h1>Корзина:</h1>
     {isLoading && <p className='loading'>Загрузка информации...</p>}
     {isError && <p className='error'>{error.message || "Произошла ошибка"}</p>}
      <h2><span className="option">Количество товаров:</span>{data ? data?.count : 0}</h2>
      <h2><span className="option">Общая цена корзины:</span>{`${data ? data?.full_price : 0}₽`}</h2>
      <h2><span className="option"></span></h2>
    </div>
  )
}

export default InfoBasket;