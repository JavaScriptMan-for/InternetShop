import { FC, useMemo } from 'react';
import Base from "@components/Base"
import Panel from '@components/Panel';
import { useQuery } from '@tanstack/react-query';
import getCategories from '../methods/getCategories.query';
import { Categories } from '../../types/query.type';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Search from '@components/Search';
import PageNumbers from '@components/pageNambers';
import { useWindow } from '../hooks/useWindow.hook'
import catalogImg from "/img/catalog.png"
const Products:FC = () => {
const size = useWindow();
  const navigate = useNavigate()
  const location = useLocation();
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })
  const getLinkStyle = useMemo(() => (path: string) => {
    return location.pathname === path ? { borderBottom: '2px solid purple' } : {};
  }, [location.pathname]);

  return (
    <>
    <Search />
    {size.width < 600 && <img onClick={() => navigate('/categories')} id='catalog' src={catalogImg} alt="Каталог" /> }
    <div id='get-products'>
      { size.width > 600 &&
      <Panel>
      {categories.isLoading && <p className='loading'>Загрузка...</p>}
      {categories.isError && <p className='error'>{categories.error.message}</p>}
      {!categories.isError && !categories.isLoading &&
      <ul>
        <li style={{marginBottom: `10px`}}><Link style={getLinkStyle('/products')} className='category' to="/products">Все товары</Link></li>
        {
     categories.data?.map((category: Categories) =>
        <li style={{marginBottom: `10px`}} key={category._id}>
          <Link style={getLinkStyle(`/products/${category.name}`)} className='category' to={`/products/${category.name}`}>{category.name}</Link>
        </li>
     )
        }
      </ul>
      }
    </Panel> 
}

    <Base>
    <Outlet />
    </Base>
    </div>
    <PageNumbers />
    </>
  )
}

export default Products;