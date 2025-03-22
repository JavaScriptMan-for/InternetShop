import { FC, ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
interface buttonProps {
    children: ReactNode;
    product_id: string;
    isDisabled?: boolean
}
const AddBasketButton:FC<buttonProps> = ({children, product_id, isDisabled}) => {
  const isAuth = useSelector((state: RootState) => state.client.isAuth)
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationKey: ['add-to-basket'],
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/basket/add/${id}`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${Cookies.get('jwt')}`
        }
      })
      const serverData = await res.json();

      if(!res.ok) throw new Error(serverData.message)

    },
    onSuccess: () => {
      navigate('/basket')
    }
  })
    const addProductToBasket = (id: string) => {
      if(!isAuth) {
        navigate('/login');
        return
      }
      mutation.mutate(id)
      location.reload()
    }
  return (
    <>
       <button disabled={isDisabled && isDisabled} onClick={() => addProductToBasket(product_id)}>{children}</button>
    </>
  )
}

export default AddBasketButton;