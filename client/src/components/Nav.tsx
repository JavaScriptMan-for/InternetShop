import { FC } from 'react';
import { NavLink, useNavigate, useLocation} from "react-router-dom";
import logo from "/favicon.ico";
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';

const Nav: FC = () => {
  const isAuth = useSelector((state: RootState) => state.client.isAuth);
  const navigate = useNavigate();
  const location = useLocation();



  const isActiveLink = (path: string | string[]): boolean => {
    if (Array.isArray(path)) {
      return path.some(item => location.pathname === item);
    }
    return location.pathname === path;
  };

  const getLinkStyle = (isActive: boolean) => {
    return isActive ? { borderBottom: '2px solid purple' } : {};
  };

  return (
    <>
    <nav>
      <img onClick={() => navigate('/')} src={logo} alt="Логотип" />
      <NavLink style={getLinkStyle(isActiveLink('/'))} to="/">
        Главная страница
      </NavLink>

      <NavLink
        to="/products"
        style={getLinkStyle(location.pathname.startsWith('/products'))} 
      >
        Товары
      </NavLink>

      <NavLink style={getLinkStyle(isActiveLink('/add-product'))} to={isAuth ? '/add-product' : '/login'}>
        Выложить товар
      </NavLink>
      <NavLink style={getLinkStyle(isActiveLink('/basket'))} to={isAuth ? '/basket' : '/login'} >
        Корзина
      </NavLink>
      {!isAuth ? (
        <button onClick={() => navigate('/login')} type="button">
          Войти
        </button>
      ) : (
        <NavLink   
         to={isAuth ? '/my-profile' : '/login'}
         style={getLinkStyle(isActiveLink('/my-profile'))}>
          Профиль
        </NavLink>
      )}
    </nav>
    </>
  );
};

export default Nav;