import { FC, useEffect, useState } from 'react';
import {useForm} from "react-hook-form"
import { User } from '@types-my/form.type';
import { Link } from 'react-router-dom';
import trueEye from "/img/trueEyes.png"
import falseEye from "/img/falseEyes.png"
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import H from '@components/H';

const Login:FC = () => {
  const {handleSubmit, register, formState: {errors, isValid}, setValue} = useForm<User>({mode: "onBlur"})

  const data_user = useSelector((state: RootState) => state.client.user_data)
  useEffect(() => {
    if(data_user.email_ && data_user.password_) {
      setValue('email' , data_user.email_)
      setValue('password', data_user.password_)
    }
  }, [data_user])
  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data:User):Promise<string> => {
      const res = await fetch('/api/users/login', {method: 'POST', body: JSON.stringify(data), headers: {
        "Content-Type": "application/json"
      }});
      const d = await res.json();
      if(!res.ok) throw new Error(d.message);

      return d.token
    },
    onSuccess: (token: string) => {
      token && Cookies.set('jwt', token)
      setIsSuccess(true)
      window.location.pathname = '/'
    }
  })

  const onSubmit = (data: User) => {
    mutation.mutate(data);
  }
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [typePassword,  setTypePassword] = useState<string>('password');
    const [enabled, setEnabled] = useState<boolean>(true)

    const showPassword = () => {
      if(enabled) {
        setTypePassword('text')
      } else {
        setTypePassword('password')
      }
      setEnabled((prev) => !prev)
    }


  return (
    <div id='div-form'>
      <form onSubmit={handleSubmit(onSubmit)}>
      <H isBack={false} isCenter={true}>Авторизация:</H>
       <label htmlFor="email-input">Email:</label>
       {errors.email && <p className='validation-error'>{errors.email.message}</p>}
       <input
       id='email-input'
       placeholder='Email'
        {...register('email', {
          required: "Это поле не может быть пустым",
          pattern: {
            value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: "Некорректный email"
          }
        })}
        type="email"
         />
         <label htmlFor="password-input">Пароль:</label>
         {errors.password && <p className='validation-error'>{errors.password.message}</p>}
         <div id="password">
          <input
          autoComplete='false'
          {...register('password', {
            required: "Это поле не может быть пустым",
            minLength: {
              value: 6,
              message: "Пароль должен состоять минимум из 6 символов"
            },
            maxLength: {
              value: 20,
              message: "Пароль должен содержать не более 20 символов"
            }
          })}
          id='password-input'
          type={typePassword}
          placeholder='Пароль'
            />
           {
           enabled
           ? <img className='eye' onClick={showPassword} src={falseEye} alt="открыто" />
           : <img className='eye' onClick={showPassword} src={trueEye} alt="закрыто" />
           }
         </div>
         <Link style={{marginBottom: '20px'}} to="/fagot-password">Забыл пароль?</Link>
      <button disabled={!isValid} type='submit'>Войти</button>
      {mutation.isPending && <p className='loading'>Загрузка...</p>}
      {mutation.isError && <p className='error'>{mutation.error?.message || 'Произошла ошибка'}</p>}
      {isSuccess && <p className='success'>Вы успешно вошли в аккаунт</p>}
      <Link style={{marginTop: '20px'}} to="/register">Нет аккаунта? Зарегистрируйтесь.</Link>
    </form>
    </div>
  )
}

export default Login;