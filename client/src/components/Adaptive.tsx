import { FC, useEffect, useRef} from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setIsOpen } from '../../store/slices/additionallySlice';
import { RootState } from 'store/store';
import closeImg from '/img/close.png';

const AdaptiveNav: FC = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state: RootState) => state.client.isAuth);
  const isOpen = useSelector((state: RootState) => state.additionally.isOpen);
  const location = useLocation();
  const adaptiveNavRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const isActiveLink = (path: string | string[]): boolean => {
    if (Array.isArray(path)) {
      return path.some(item => location.pathname === item);
    }
    return location.pathname === path;
  };

  const getLinkStyle = (isActive: boolean) => {
    return isActive ? { borderBottom: '2px solid purple' } : {};
  };

  const handleClick = (): void => {
    dispatch(setIsOpen(false));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adaptiveNavRef.current && !adaptiveNavRef.current.contains(event.target as Node)) {
        dispatch(setIsOpen(false));
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartX.current !== null) {
        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchStartX.current - touchEndX;
        if (deltaX > 50) {
          dispatch(setIsOpen(false));
        }

        touchStartX.current = null;
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, dispatch]);

  return (
    <div id='adaptive-nav' ref={adaptiveNavRef}>
      <img onClick={handleClick} id='closeImg' src={closeImg} alt="Закрыть" />
      <NavLink style={getLinkStyle(isActiveLink('/'))} to="/" onClick={handleClick}>
        Домашняя
      </NavLink>

      <NavLink
        to="/products"
        style={getLinkStyle(location.pathname.startsWith('/products'))}
        onClick={handleClick}
      >
        Товары
      </NavLink>

      <NavLink style={getLinkStyle(isActiveLink('/add-product'))} to={isAuth ? '/add-product' : '/login'} onClick={handleClick}>
        Выложить товар
      </NavLink>
      <NavLink style={getLinkStyle(isActiveLink('/basket'))} to={isAuth ? '/basket' : '/login'} onClick={handleClick}>
        Корзина
      </NavLink>
      {!isAuth ? (
        <NavLink style={getLinkStyle(isActiveLink('/login'))} onClick={() => dispatch(setIsOpen(false))} to="/login" >
          Войти
        </NavLink>
      ) : (
        <NavLink
          to={isAuth ? '/my-profile' : '/login'}
          onClick={handleClick}
          style={getLinkStyle(isActiveLink('/my-profile'))}>
          Профиль
        </NavLink>
      )}
    </div>
  );
};

export default AdaptiveNav;