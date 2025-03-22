import { FC } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MyProducts } from "@types-my/query.type"
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import defaultImg from "/img/default.png"


const My_products:FC = () => {
  const {data, isLoading, isError, error} = useQuery({
    queryKey: ['get-my-products'],
    queryFn: async ():Promise<MyProducts[]> => {
      const res = await fetch('/api/products/get-profile-products', {headers: {
        "Authorization": `Bearer ${Cookies.get('jwt')}`
      }})
      const serverData = await res.json();
  
      if(!res.ok) throw new Error(serverData.message)
  
      return serverData.my_products
    }
  })
  const deleteMutation = useMutation({
    mutationKey: ['delete-my-product'],
    mutationFn: async (id: string):Promise<string> => {
      const res = await fetch(`api/products/delete/${id}`, {method: "DELETE",  headers: {
        "Content-Type": "application/json"}})
      const serverData = await res.json();

      if(!res.ok) {
        throw new Error(serverData.message)
      }
      return serverData.message
    },
    onSuccess: () => {
      location.reload()
    }

  })
  
  const deleteProduct = (id: string) => {
      deleteMutation.mutate(id)
  }
  return (
    <>
    <span className='option' id='h2_profile' style={{marginBottom: '20px'}}>Ваши продукты:</span>
    <div id='get-my-products'>

      <div className="base">
      {isLoading && <p className='loading'>Загрузка...</p>} 
      {isError && <p className='error'>{error.message || 'Произошла ошибка'}</p>} 
      {
        data && !error &&  data.map((product: MyProducts) => 
          <div className='product' key={product._id}>
                 <h1>{product.title}</h1>
           <Link id='link' to={`/get-one-my/${product._id}`}>
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
           <button onClick={() => deleteProduct(product.my_id)} type='button'>Удалить товар</button>
          </div>
        )
      }
      </div>
    </div>
    </>
  )
}

export default My_products;