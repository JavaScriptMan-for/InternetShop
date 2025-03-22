import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IVerify } from '@types-my/form.type';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from 'store/store';
const Verify:FC = () => {
  const step = useSelector((state: RootState) => state.client.step)
  const navigate = useNavigate();

  useEffect(()=> {
    if(!step) navigate('/')
  }, [step])
  const mutation = useMutation({
    mutationKey: ['verify'],
    mutationFn: async (data: IVerify):Promise<string> => {
      const res = await fetch('/api/users/verify', {method: 'POST', body: JSON.stringify(data), headers: {
        "Content-Type": "application/json"
      }})
      const d = await res.json();
      if(!res.ok) throw new Error(d.message)

      return d.message
    },
    onSuccess: () => {
      navigate('/login')
    }
  })
  const {register,handleSubmit, watch, formState: {errors, isValid}, setValue} = useForm<IVerify>({mode: "onChange"})

  const onSubmit_ = (data: IVerify) => {
    mutation.mutate(data)
  }

  const code:number = watch('clientCode')
  useEffect(() => {
    if (errors.clientCode?.type === "pattern") {
      const str_code:string = code.toString()
      if(str_code.length > 6) {
        const result_str: string = str_code.slice(0, 6)
        setValue('clientCode', Number(result_str))
      }
    }
  }, [code, errors.clientCode]);
  return (
    <div id='div-form'>
  
    <form onSubmit={handleSubmit(onSubmit_)} >
      <h1>Подтверждение</h1>
       <input
       placeholder='Код'
       type="number" {...register('clientCode', {
          required: "Это поле не может быть пустым",
          pattern: {
            value: /^[0-9]{6}$/,
            message: "Некорректный код"
          },
       })}
        />
        <button disabled={!isValid} type='submit'>Подтвердить</button>
        {errors && <p className='error'>{errors.clientCode?.message}</p>}
        {mutation.isError && <p className='error'>{mutation.error?.message || 'Произошла ошибка'}</p>}
        {mutation.isPending && <p className='loading'>Загрузка...</p>}
        <Link to="/register">Назад</Link>
    </form>
    </div>
  )
}

export default Verify;