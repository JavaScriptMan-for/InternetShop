import { Email } from '@types-my/form.type';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';

import { setIsSend } from '@slices-my/additionallySlice'
import { setEmail } from '@slices-my/clientSlice';
import Cookies from 'js-cookie';
import { RootState } from 'store/store';
import H from './H';

const SendToEmail:FC = () => {
  const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.client.email)

  const {handleSubmit, register,formState: { errors, isValid }} = useForm<Email>({mode: 'onBlur'})



  const mutation = useMutation({
    mutationKey: ['send-mail'],
    mutationFn: async (data: Email):Promise<string> => {
      const res = await fetch('/api/users/send-code-fagot',  {
        method: 'POST', 
        body: JSON.stringify(data),
        headers: {
          "Content-Type": 'application/json'
        }
    })
    const serverData = await res.json();

    if(!res.ok) throw new Error(serverData.message)
    return serverData.email
    },
    onSuccess: (data: string) => {
      dispatch(setEmail(data))
    email && Cookies.set('email', email)
      dispatch(setIsSend(true))
    },
    onError: () => {
      dispatch(setEmail(null))
      dispatch(setIsSend(false))
    }
  })
  const onSubmit = (data: Email) => {
    mutation.mutate(data)
  }

  return (
    <div id='div-form'>

       <form onSubmit={handleSubmit(onSubmit)}>
        <H isCenter={true}>Забыл пароль:</H>
        {errors.email && <p className='validation-error'>{errors.email.message}</p>}
        <input
         placeholder='Email'
         type="email"
          {...register('email', {
               required: "Это поле не может быть пустым",
               pattern: {
                 value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                 message: "Некорректный email"
               }
        })}/>
      {mutation.isPending && <p className='loading'>Загрузка...</p>}
      {mutation.error && <p className='error'>{mutation.error.message}</p>}

        <button disabled={!isValid} type='submit'>Отправить письмо</button>
       </form>
    </div>
  )
}

export default SendToEmail;