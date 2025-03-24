import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWindow } from '../../src/hooks/useWindow.hook'
import { Helmet } from 'react-helmet-async'


const Main_page:FC = () => {
  const navigate = useNavigate();
  const windowSize = useWindow()
  return (
    <>
    <Helmet>
      <meta name="description" content="Добро пожаловать на Accessfull! Accessfull - интернет-магазин. Здесь Вы можете найти технику и аксессуары к ней" />
    </Helmet>
    <main>
       <h1>Добро пожаловать на Accessfull</h1>
       <h2>Accessfull - интернет-магазин {windowSize.width < 700 && <br />} техники и аксессуаров к ней</h2>
       <h3>Чтобы что-нибудь купить кликайте на кнопку</h3>
       <button onClick={()=> navigate('/products')} className='butt' type='button'>За покупками!</button>
    </main>
    </>
  )
}

export default Main_page;