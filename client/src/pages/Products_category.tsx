import { FC, useEffect } from 'react';
import { useParams, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Products } from '@types-my/query.type'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { setTotalPages } from '../../store/slices/clientSlice';
import defaultImg from "/img/default.png"
import Button from "../components/Add_basket_button"

const Products_category:FC = () => {
  const [searchParams] = useSearchParams(); // Получаем объект URLSearchParams
  const searchTerm = searchParams.get('title') || ''; 



  const {category} = useParams();
  const location = useLocation();
  const productsPerPage = 10;
  
  const currentPage = useSelector((state: RootState) => state.client.currentPage)

  const dispatch = useDispatch();
  const {data, isLoading, isError, error, refetch} = useQuery({
    queryKey: ['products-by-category',category, currentPage],
    queryFn: async ():Promise<{products: Products[], totalPages: number}> => {
      if(!category) throw new Error('Такая категория не найдена')
      const response = await fetch(`/api/products/get-products/${category}?page=${currentPage}&limit=${productsPerPage}&title=${searchTerm}`)
      
    const data = await response.json();

      if(!response.ok) {
        throw new Error(data.message)
      }
     dispatch(setTotalPages(data.totalPages))
      return data;
    },
  })
  useEffect(()=> {
    refetch()
}, [searchTerm])
  useEffect(()=> {
    refetch()
  }, [location])

  return (
    <>
       {isLoading && <p className='loading'>Загрузка...</p>}
       {isError && <p className='error'>{error.message || "Произошла ошибка"}</p>}
       {!isLoading && !isError && 
        data && data.products.length > 0 && data.products?.map((product: Products) => 
              <div className='product' key={product._id}>
                <h1>{product.title}</h1>
                <Link id='link' to={`/product/${product._id}`}>
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
                 { product.description.length > 30 ?
            <p>{`${product.description.slice(0, 30)}...`}</p> :
            <p>{product.description}</p> 
             } 
                  <h2>{product.price} ₽</h2>

                  <Button product_id={product._id}>Добавить в корзину</Button>
              </div>
          )
       }
    </>
  )
}

export default Products_category;