import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import trueEye from "/img/trueEyes.png"
import falseEye from "/img/falseEyes.png"
import {User} from "@types-my/form.type"
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setStep } from '../../store/slices/clientSlice'
import { setUserData } from '../../store/slices/clientSlice';
import H from '@components/H';
const Register:FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [typePassword,  setTypePassword] = useState<string>('password');
  const [enabled, setEnabled] = useState<boolean>(true)
  const {
    register, handleSubmit,watch, formState: {
      isValid, errors
    },
    getValues
  } = useForm<User>({mode: 'onBlur'})
  const {email, password} = watch()
  const genderValue = watch('gender');
  const isFirstOptionGrey = !genderValue;
  useEffect(()=> {
    console.log(isFirstOptionGrey)
  }, [isFirstOptionGrey])

  const mutation = useMutation({
    mutationKey: ['register'],
    mutationFn: async (data_: User) => {
      const res = await fetch('/api/users/register', {method: "POST",body: JSON.stringify(data_), headers: {
        "Content-Type": "application/json"
      }})
      const da = await res.json()
      console.log(da)
      if(!res.ok) throw new Error(da.message)
    },
    onSuccess: () => {
      dispatch(setUserData({
        email_: email,
        password_: password
      }))
      setIsSuccess(true)
      dispatch(setStep(true))
      navigate('/verify')
    }
  })
  const showPassword = () => {
    if(enabled) {
      setTypePassword('text')
    } else {
      setTypePassword('password')
    }
    setEnabled((prev) => !prev)
  }
  const onSubmit = async (data: User) => {
    mutation.mutate(data)
  }
  return (
    <div id='div-form'>
    <form onSubmit={handleSubmit(onSubmit)}>
      <H isBack={false} isCenter={true}>Регистрация</H>
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
         <label htmlFor="password-input-verify">Повторить пароль:</label>
            {errors.password_verify && <p className='validation-error'>{errors.password_verify.message}</p>}
              <input
          {...register('password_verify', {
            required: "Это поле не может быть пустым",
            validate: (value: string) => {
               return value === getValues('password') || "Пароли должны совпадать";
            }
          })}
          id='password-input-verify'
          type='password'
          placeholder='Пароль'
            />
             <label htmlFor="fullname-input">ФИО:</label>
             {errors.fullname && <p className='validation-error'>{errors.fullname.message}</p>}
          <input
           id='fullname-input'
           type="text"
           placeholder='ФИО'
           {...register('fullname', {
            required: "Это поле не может быть пустым",
            validate: (value) => {
              const parts = value.split(' ');
              return parts.length >= 2 || "Пожалуйста, введите имя, фамилию и отчество (если есть)";
            },
          })}
           />
           <label htmlFor="gender-input">Пол:</label>
           {errors.gender && <p className='validation-error'>{errors.gender.message}</p>}
           <select
            style={isFirstOptionGrey ? {color: 'grey'} : {color: "black"}}
            id="gender-input"
            {...register('gender', {
              required: "Пожалуйста, выберите пол",
              validate: (value) => {
                  return value === 'man' || value === 'woman' || "Пожалуйста, выберите пол";
              }
            })}
            >
            <option value="" defaultValue="">Выберите пол</option>
            <option value="man">Мужчина</option>
            <option value="woman">Женщина</option>
           </select>
      <button disabled={!isValid} type='submit'>Зарегистрироваться</button>
      {mutation.isPending && <p className='loading'>Загрузка...</p>}
      {mutation.isError && <p className='error'>{mutation.error?.message || 'Произошла ошибка'}</p>}
      {isSuccess && <p className='success'>Письмо с кодом отправлено на почту</p>}
      <Link style={{marginTop: '20px'}} to="/login">Есть аккаунт? Авторизуйтесь.</Link>
    </form>
    </div>
  )
}

export default Register;