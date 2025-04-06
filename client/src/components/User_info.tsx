import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserData } from '@types-my/query.type';
import userImg from "/img/user.png"
import Cookies from 'js-cookie';
import Out from './Out';
import Logout from './Logout';

const User_info:FC = () => {
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['get-user-data'],
        queryFn: async () => {
            const res = await fetch('/api/users/protected', {
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`
                }
            });
            const serverData:UserData = await res.json();

            if(!res.ok) throw new Error(serverData.message)
            
            return serverData.user
        }
    })
  return (
    <> 
    {isError && <p className='error'>{error.message || "Произошла ошибка"}</p>}
    {isLoading && <p className='loading'>Загрузка...</p>}
    { data &&
    <div id='user-info'>
        <div className='inline'>
            <img src={userImg} alt="Пользователь" />
            <div>
            <h1>{data?.fullname}</h1>
            <p className='lazy'>{data?.userId}</p>
            </div>
        </div>
       <div className="inline">
        <span className="option">Пол:</span>
        <p>{data?.gender === 'man' ? 'Мужской' : 'Женский'}</p>
       </div>
        <Out />
        <Logout />
    </div>
    }
    </>
  )
}

export default User_info;