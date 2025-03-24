import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import getCategories from '@methods/getCategories.query';
import { Categories } from '@types-my/query.type';
import { Link } from 'react-router-dom';
import H from '@components/H';

const Categories_page:FC = () => {
    const categories = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
      })
  return (
    <>  
    <div id='categories'>
        <H>Категории:</H>
        <Link to="/products">Все товары</Link>
        {categories.data?.map((category: Categories) => 
            <Link to={`/products/${category.name}`} key={category._id}>{category.name}</Link>
        )}
    </div>
    </>
  )
}

export default Categories_page;