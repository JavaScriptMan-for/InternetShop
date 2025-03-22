import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound:FC = () => {
    useEffect(()=> {
        document.title = "Страница не найдена"
    }, [])
  return (
    <div id='not'>
       <h1>Страница не найдена</h1>
       <h2>404</h2>
       <h3>Пожалуйста, удостоверьтесь, что <br /> данная страница существует.</h3>
       <Link to="/">На главную</Link>
    </div>
  )
}

export default NotFound;