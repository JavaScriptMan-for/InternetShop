import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { TypeInfoBasket } from '@types-my/query.type';
import { RootState } from 'store/store';
import H from './H';


const InfoBasket:FC = () => {
const updateCount = useSelector((state: RootState) => state.additionally.updateCount)

  const { data, isLoading, isError, refetch } = useQuery({
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
     <H>Корзина:</H>
      <h2><span className="option">Количество товаров:</span>{data && !isLoading && !isError ? data?.count : 'Загрузка информации...'}</h2>
      <h2><span className="option">Общая цена корзины:</span>{`${data && !isLoading && !isError ? `${data?.full_price}₽` : 'Загрузка информация...'}`}</h2>
      <h2><span className="option"></span></h2>
    </div>
  )
}

export default InfoBasket;