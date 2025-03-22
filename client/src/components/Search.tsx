import { FC, useState } from 'react';
import searchImg from "/img/search.png";
import { useNavigate, useSearchParams } from 'react-router-dom';

const Search: FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('title') ? String(searchParams.get('title')) : '');

    const handleSearch = () => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (searchTerm.trim() !== "") {
          newSearchParams.set('title', searchTerm);
          localStorage.setItem('search', searchTerm);
      } else {
            localStorage.setItem('search', '');
          newSearchParams.delete('title');
      }
        navigate(`?${newSearchParams.toString()}`);
    };

    return (
        <div id="search">
            <input
                placeholder='Найти товар...'
                type="search"
                name="title"
                id="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {if (e.key === 'Enter') {handleSearch()}}}
            />
            <button type='button' onClick={handleSearch}>
                <img src={searchImg} alt="Найти" />
            </button>
        </div>
    );
};

export default Search;