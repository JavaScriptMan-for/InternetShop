import { FC } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { Basket } from '@types-my/query.type';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { plusUpdateCount } from '@slices-my/additionallySlice';
import defaultImg from "/img/default.png"

const GetBasketProducts:FC = () => {
  const dispatch = useDispatch();
    const mutation = useMutation({
      mutationKey: ['delete-item'],
      mutationFn: async (id: string) => {
        const res = await fetch(`/api/basket/delete/${id}`, {method: "DELETE", headers: {
          "Authorization": `Bearer ${Cookies.get('jwt')}`
        }})
        const serverData = await res.json();
        if(!res.ok) throw new Error(serverData.message)

      },
      onSuccess: () => {
        document.location.reload()
      }
    })
    const {data, isLoading, isError, error, refetch} = useQuery({
      queryKey: ['get-basket'],
      queryFn: async ():Promise<Basket[]> => {
          const res = await fetch('/api/basket/get', {headers: {
              "Authorization": `Bearer ${Cookies.get('jwt')}`
          }})
          const serverData = await res.json();
          if(!res.ok) throw new Error(serverData.message)

          return serverData.get_products_in_basket
      }
  })
    const mutationPlus = useMutation({
      mutationKey: ['plus'],
      mutationFn: async (id: string) => {
        const res = await fetch(`/api/basket/increase/${id}`, {method: 'PUT', headers: {
          "Authorization": `Bearer ${Cookies.get('jwt')}`
        }})
        const sd = await res.json();

        if(!res.ok) throw new Error(sd.message)
        
        return sd.result
      },
    onSuccess: async () => {
      dispatch(plusUpdateCount())
      refetch()
    }
    })
    const mutationMinus = useMutation({
      mutationKey: ['minus'],
      mutationFn: async (id: string) => {
        const res = await fetch(`/api/basket/decrease/${id}`, {method: 'PUT', headers: {
          "Authorization": `Bearer ${Cookies.get('jwt')}`
        }})
        const sd = await res.json();

        if(!res.ok) throw new Error(sd.message)
        return sd.result
      },
    onSuccess: async () => {
      dispatch(plusUpdateCount())
      refetch()
    }
    })
    const deleteItem = (id: string) => {
      mutation.mutate(id)
    }
    const plus = (id: string) => {
      mutationPlus.mutate(id)
    }
    const minus = (id: string) => {
      mutationMinus.mutate(id)  
    }
  return (
    <div id='get-my-products'>
    <div className='base'>
      {isLoading && <p className='loading'>Загрузка...</p>}
      {isError && <p className='error'>{error.message}</p>}
        {!isLoading && !isError && 
           data && data?.map((product: Basket) => 
            <div className='product' key={product._id}>
           <h1>{product.title}</h1>
           <Link id='link' to={`/product/${product.my_id}`}>
            <img
                   draggable="false"
                   src={`${import.meta.env.VITE_URL}${product.images[product.images.length - 1]}`}
                   alt={product.title}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = defaultImg;
                  }}
               />
            </Link>
             <h2>{product.price} ₽</h2>
             { product.description.length > 30 ?
            <p>{`${product.description.slice(0, 30)}...`}</p> :
            <p>{product.description}</p> 
             }
             <div className='buttons'>
           <button className='delete_basket_product' onClick={() => deleteItem(product._id)} type='button'>Удалить из корзины</button>
           <div id="update">
           <button disabled={product.count === 1} onClick={() => minus(product._id)} className='increment' type='button'>-</button>
           <span>
             {product.count}
           </span>
           <button onClick={() => plus(product._id)} className='increment' type='button'>+</button>
           </div> 
             </div>
         </div>
          )
       }
    </div>
    </div>
  )
}

export default GetBasketProducts;