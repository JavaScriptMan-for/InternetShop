import { FC } from 'react';
import logoutImg from "/img/out.png"
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Logout:FC = () => {
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationKey: ['logout-account'],
        mutationFn: async (): Promise<void> => {
            const response = await fetch('/api/users/logout', {
                method: 'HEAD',
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`
                  }
            })
            const serverData = await response.json();

            if(!serverData.ok) throw new Error(serverData.message)

         }
    })

    const logoutAccount = (): void => {
        mutation.mutate();
        Cookies.remove('userId');
        Cookies.remove('jwt');
        navigate('/')
        document.location.reload();
    }

  return (
    <div onClick={logoutAccount} style={{marginBottom: '20px'}} className='account-methods'>
        <img src={logoutImg} alt="Выйти из аккаунта" />
       <span>Выйти из аккаунта</span>
    </div>
  )
}

export default Logout;