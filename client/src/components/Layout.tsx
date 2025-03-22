import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import AdaptiveNav from './Adaptive';
import Menu from './Menu';
import { useWindow } from '../hooks/useWindow.hook';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { PropertiesOverflow } from '@types-my/hooks.type';

const Layout:FC = () => {
  const isOpen = useSelector((state: RootState) => state.additionally.isOpen)
  const size = useWindow();
  useEffect(()=> {
    const adaptive_nav =  document.querySelector('#adaptive-nav') as HTMLElement;
    if(adaptive_nav) {
    isOpen ? adaptive_nav.classList.add('isOpen') : adaptive_nav.classList.remove('isOpen')
    isOpen ? document.body.style.overflowY = PropertiesOverflow.HIDDEN : document.body.style.overflowY = PropertiesOverflow.SCROLL
    }
  }, [isOpen])
  return (
    <>
    {
    size.width > 500 ?
    <Nav /> :
    <>
    <Menu/>
    <AdaptiveNav />
    </>
    }
    <Outlet />
    </>
  )
}

export default Layout;