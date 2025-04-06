import { FC, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/store'
import {setIsAuth, setUserId} from '../store/slices/clientSlice'
import Cookies from 'js-cookie'
import { useQuery } from '@tanstack/react-query'

import Layout from './components/Layout'
import Main_page from './pages/Main_page'
import Products from './pages/Products'
import Product from './pages/One_Product'
import Add_product from './pages/Add_Product'
import Products_category from './pages/Products_category'
import Basket from './pages/Basket'
import Profile from "./pages/Profile"
import RedactProduct from './pages/Redact_One_product'
import Categories_page from './pages/Categories'
import NotFound from './pages/NotFound'

import Register from './pages/Register'
import Login from './pages/Login'
import Verify from './pages/Verify'
import FagotPassword from './pages/Fagot_password'


const App:FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuth = useSelector((state: RootState) => state.client.isAuth)

  const {data, isLoading, isError, refetch} = useQuery<string>({
    queryKey: ['protected'],
    queryFn: async ():Promise<string> => {
      const res = await fetch('/api/users/protected', {headers: {
        "Authorization": `Bearer ${Cookies.get('jwt')}`
      }})
      const d = await res.json()
      if(!res.ok) {
        dispatch(setIsAuth(false))
        console.log("Вы не авторизованы")
        throw new Error(d.message)
      };

      
      dispatch(setIsAuth(true))
      Cookies.set('userId', d.user.userId)
      return d.user.userId
    },
  })
  useEffect(()=> {
    refetch()
  }, [Cookies.get('jwt')])
  useEffect(()=> {
    const l = location.pathname
    if(!isAuth && l === '/profile') {
        navigate('/')
    }
    if(isAuth && l === "/login") {
      navigate('/')
    }
    if(isAuth && l === "/register") {
      navigate('/')
    }
    if(isAuth && l === "/fagot-password") {
      navigate('/')
    }
    if(isAuth && l === "/verify") {
      navigate('/')
    }
    if(!isAuth && l === '/basket') {
      navigate('/')
    }
    if(!isAuth && l === '/add-product') {
      navigate('/')
    }
    if(!isAuth && l.startsWith('/get-one-my/')) {
      navigate('/')
    }
  }, [location])
  useEffect(()=> {
    switch (location.pathname) {
      case '/':
        document.title = "Accessfull - интернет магазин для Вас"
        break;
      case '/products': 
      document.title = "Товары"
        break;
        case '/basket':
          document.title = "Корзина"
          break;
          case '/add-product':
            document.title = "Выложить свой товар"
            break;
            case '/my-profile':
              document.title = "Мой профиль"
              break;
        case '/login': 
      document.title = "Авторизация"
        break;
        case '/register': 
        document.title = "Регистрация"
          break;
          case '/verify': 
        document.title = "Верификация"
          break;
          case '/fagot-password': 
          document.title = "Забыл пароль"
            break;
      default: "Accessfull - интернет магазин для Вас! Здесь Вы можете найти технику и аксессуары к ней по дешёвым ценам!"
    }
  } , [location])
  //Title
  useEffect(() => {
    if(!isLoading && !isError) {
     data && setUserId(data)
    }
  }, [data])
  return (
 <Routes>
        <Route path="/" element={<Layout />}>
          {/* Главная страница */}
          <Route index element={<Main_page />} />

          {/* Корзина - теперь внутри Layout */}
          <Route path="basket" element={<Basket />} />
          <Route path='categories' element={<Categories_page />}/>

          {/*Профиль внутри Layout*/}
          <Route path='my-profile' element={<Profile />}/>
          <Route path="get-one-my/:id" element={<RedactProduct />}/>

          {/* Страница продуктов и вложенная категория */}
            <Route path="products" element={<Products />} >
          <Route path=":category" element={<Products_category />} />  {/* Исправлено: путь */}
            </Route>
          {/* Страница добавления продукта */}
          <Route path="add-product" element={<Add_product />} />
          </Route>
           {/* Страница отдельного продукта */}
          <Route path="product/:id" element={<Product />} />
        {/* Маршруты вне Layout (регистрация, логин, верификация) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/fagot-password" element={<FagotPassword />}/>
        <Route path='*' element={<NotFound />}/>
      </Routes>
  )
}

export default App
