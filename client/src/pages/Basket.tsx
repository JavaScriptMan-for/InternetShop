import { FC } from 'react';
import GetBasketProducts from '../components/getBasketProducts';
import InfoBasket from '../components/InfoBasket';

const Basket:FC = () => {
  return (
    <>
       <InfoBasket />
       <GetBasketProducts />
    </>
  )
}

export default Basket;