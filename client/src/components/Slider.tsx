import { useSelector } from 'react-redux';
import { FC, useState } from 'react';
import directory from "/img/directory.png"
import defaultImg from "/img/default.png"
import { RootState } from 'store/store';
interface SliderProps {
    data: string[] | undefined;
}
const Slider:FC<SliderProps> = ({data}) => {
    const isOpen = useSelector((state: RootState) => state.additionally.isOpen)
    const images = data?.map((image: string) => image) || defaultImg
    const [count, setCount] = useState<number>(0)
    const increment = (): void => {
      setCount((prevCount) => {
        const newCount = prevCount + 1;
        return newCount === images.length ? 0 : newCount;
      });
    };
    const decrement = (): void => {
      setCount((prevCount) => {
        const newCount = prevCount - 1;
        return newCount < 0 ? images.length - 1 : newCount;
      });
    };
  return (
    <div id='slider'>
       {!isOpen && <img onClick={decrement} className='arrow' style={{rotate: '180deg'}} src={directory} alt="влево" /> }
            <img
        id='slider-img'
        draggable="false"
        src={`${import.meta.env.VITE_URL}${images[count]}`}
        alt={'Картинки'}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.onerror = null; 
         e.currentTarget.src = defaultImg;
   }}
              />
        <img onClick={increment} className='arrow' src={directory} alt="вправо" />
    </div>
  )
}

export default Slider;