import { FC } from 'react';
import { setCurrentPage } from '../../store/slices/clientSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const PageNumbers:FC = () => {
    const {category} = useParams()
    const dispatch = useDispatch();
    const totalPages = useSelector((state: RootState) => state.client.totalPage)
    const currentPage = useSelector((state: RootState) => state.client.currentPage)

       const handlePageChange = (newPage: number) => {
            dispatch(setCurrentPage(newPage));
        };
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <Link
                    to={category ? `/products/${category}` : '/products'}
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i}
                </Link>
            );
        }
        return pageNumbers;
    };
  return (
    <>
    { totalPages !== 1 &&
    <nav className='pagination'>
       {renderPageNumbers()}
    </nav>
    }
    </>
  )
}

export default PageNumbers;
//Дополнить