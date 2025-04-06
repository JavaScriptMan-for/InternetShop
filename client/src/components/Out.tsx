import { FC } from 'react';
import outImg from "/img/delete.png"
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

const Out:FC = () => {

    const mutation = useMutation({
        mutationKey: ['delete-account'],
        mutationFn: async (): Promise<void> => {
            const response = await fetch('/api/users/delete-account', {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${Cookies.get('jwt')}`
                  }
            })
            const serverData = await response.json();

            if(!serverData.ok) throw new Error(serverData.message)

         }
    })

    const deleteAccount = (): void => {
        mutation.mutate();
        Cookies.remove('jwt')
        Cookies.remove('userId');
        document.location.reload()
    }

  return (
    <div onClick={deleteAccount} style={{marginBottom: '20px'}} className='account-methods'>
        <img src={outImg} alt="Выйти из аккаунта" />
       <span>Удалить аккаунт</span>
    </div>
  )
}

export default Out;