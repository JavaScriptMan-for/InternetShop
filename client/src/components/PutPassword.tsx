import { FC, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { IFagotPassword } from '@types-my/form.type';
import { RootState } from 'store/store';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query"
import { setEmail } from '@slices-my/clientSlice';
import { setIsSend } from '@slices-my/additionallySlice';

import trueEye from "/img/trueEyes.png"
import falseEye from "/img/falseEyes.png"
import Cookies from 'js-cookie';

const PutPassword:FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [typePassword, setTypePassword] = useState<string>('password')

  const dispatch = useDispatch()
  const email = useSelector((state: RootState) => state.client.email)

  const { handleSubmit, register, watch, setValue, getValues, formState: {errors, isValid} } = useForm<IFagotPassword>({mode: "onChange"})
  
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ['put-password'],
    mutationFn: async (data: IFagotPassword) => {
      console.log(data);
      
      const res = await fetch('/api/users/put-password',{
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const serverData = await res.json();

      if(!res.ok) throw new Error(serverData.message);
    },
    onSuccess: () => {
      dispatch(setEmail(null));
      dispatch(setIsSend(false))
      Cookies.remove('email')
      navigate('/login')
    }
  })

  const onSubmit = (data: IFagotPassword) => {
   const obj: IFagotPassword = {
    email: email || Cookies.get('email'),
    code_verify: data.code_verify,
    newPassword: data.newPassword
   }
   console.log(obj);
   
   mutation.mutate(obj)
  }
    const code:number = watch('code_verify')
    useEffect(() => {
      if (errors.code_verify?.type === "pattern") {
        const str_code:string = code.toString()
        if(str_code.length > 6) {
          const result_str: string = str_code.slice(0, 6)
          setValue('code_verify', Number(result_str))
        }
      }
    }, [code, errors.code_verify]);

    const showPassword = () => {
      setEnabled((prev) => !prev)
      if(!enabled) {
        setTypePassword('text')
      } else {
        setTypePassword('password')
      }
    }

  return (
    <div id='div-form'>
       <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Изменить пароль</h1>
        <label htmlFor="input-code">Код:</label>
        {errors.code_verify && <p className='validation-error'>{errors.code_verify.message}</p>}
       
        <input 
          id='input-code'
          placeholder='Код'
          type="number"
           {...register('code_verify', {
            required: "Это поле не может быть пустым",
            pattern: {
              value: /^[0-9]{6}$/,
              message: "Некорректный код"
            },
          })} />
          <label htmlFor="input-new-password">Новый пароль:</label>
          {errors.newPassword && <p className='validation-error'>{errors.newPassword.message}</p>}
          <div id="password">
          <input
          id='input-new-password'
           type={typePassword}
           placeholder='Новый пароль'
           {...register('newPassword', {
            required: "Это поле не может быть пустым",
            maxLength: {
              value: 20,
              message: "Пароль должен состоять от 6 до 20 символов"
            },
            minLength: {
              value: 6,
              message: "Пароль должен состоять от 6 до 20 символов"
            }
           })}
           />
              {
           enabled
            ? <img className='eye' onClick={showPassword} src={trueEye} alt="открыто" />
            : <img className='eye' onClick={showPassword} src={falseEye} alt="закрыто" />
           }
             </div>
           <label htmlFor="input-verify-password">Повторить новый пароль:</label>
           {errors.verify_password && <p className='validation-error'>{errors.verify_password.message}</p>}
           <input
           id='input-verify-password'
            placeholder='Повторить новый пароль'
            type="password"
            {...register('verify_password', {
              required: "Это поле не может быть пустым",
              validate: (value: string | undefined) => {
                 return value === getValues('newPassword') || "Пароли должны совпадать";
              }
            })}
             />
      {mutation.isPending && <p className='loading'>Загрузка...</p>}
      {mutation.error && <p className='error'>{mutation.error.message}</p>}

             <button style={{marginBottom: '20px'}} disabled={!isValid} type="submit">Изменить пароль</button>
             <Link to="/login">Назад</Link>
       </form>
    </div>
  )
}

export default PutPassword;