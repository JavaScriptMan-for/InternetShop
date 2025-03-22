import { FC, ReactNode, useEffect } from 'react';
import defaultImg from "/img/default.png";
import { useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Products } from '../../types/query.type';
import Button from "../components/Add_basket_button";
import { useDispatch, useSelector } from 'react-redux';
import { setTotalPages } from '../../store/slices/clientSlice'
import { RootState } from 'store/store';
import { useSearchParams } from 'react-router-dom';
interface BaseProps {
    children: ReactNode;
}

const Base: FC<BaseProps> = ({ children }) => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams(); // Получаем объект URLSearchParams
    const searchTerm = searchParams.get('title') || ''; 

    const productsPerPage = 10;
  const currentPage = useSelector((state: RootState) => state.client.currentPage)
    const { data, isError, isLoading, error, refetch } = useQuery({
        queryKey: ['all-products', currentPage],
        queryFn: async (): Promise<any> => { // Изменяем тип на any, чтобы включить totalPages
            const response = await fetch(`/api/products/get-all?page=${currentPage}&limit=${productsPerPage}&title=${searchTerm}`);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message)
            }
            dispatch(setTotalPages(data.totalPages))
            return data; 
        },
        placeholderData: (previousData) => previousData,
    });

    const location = useLocation();

  
    
useEffect(()=> {
    refetch()
}, [searchTerm])
useEffect(()=> {
    refetch()
}, [location])

    return (
        <div id='render'>
            <div className='base'>
                {isLoading && <p className='loading'>Загрузка</p>}
                {isError && <p className='error'>{error.message || "Произошла ошибка"}</p>}
                {location.pathname !== '/products' && children}
                {!isLoading && !isError && location.pathname === '/products' &&
                    data?.all_products && !isLoading  && !isError &&
                    <>
                        {data.all_products?.map((product: Products) =>
                            <div className='product' key={product._id}>
                                {
                                product.title.length < 20 ?
                                <h1>{product.title}</h1> :
                                <h1>{`${product.title.slice(0, 20)}...`}</h1>
                                }
                               
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
                                <h2>{product.price} ₽</h2>
                                {product.description.length > 30 ?
                                    <p>{`${product.description.slice(0, 30)}...`}</p> :
                                    <p>{product.description}</p>
                                }
                                <Button product_id={product._id}>Добавить в корзину</Button>
                            </div>
                        )}
                    </>
                }
            </div>
        </div>
    );
}

export default Base;