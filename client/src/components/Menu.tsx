import { FC } from 'react';
import menuImg from "/img/menu.png"
import { useDispatch, useSelector } from 'react-redux';
import { setIsOpen } from '../../store/slices/additionallySlice'
import { RootState } from 'store/store';


const Menu:FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.additionally.isOpen)

  const handleClick = ():void => {
    dispatch(setIsOpen(!isOpen))
  }
  return (
    <>
    <img onClick={handleClick} id='menu' src={menuImg} alt="Меню" />
    </>
  )
}

export default Menu;