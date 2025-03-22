import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import getCategories from '@methods/getCategories.query';
import { Categories } from '@types-my/query.type';
import { Link, useNavigate } from 'react-router-dom';

const Categories_page:FC = () => {
    const navigate = useNavigate();
    const categories = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
      })
  return (
    <>  
    <div id='categories'>
        <h1>Категории:</h1>
        <Link to="/products">Все товары</Link>
        {categories.data?.map((category: Categories) => 
            <Link to={`/products/${category.name}`} key={category._id}>{category.name}</Link>
        )}
    </div>
    <Link style={{color: "white", marginLeft: '10px'}} to="" onClick={() => navigate(-1)}>Назад</Link>
    </>
  )
}

export default Categories_page;