import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import back from "/img/back.png"

interface Props {
    children: ReactNode;
    isBack?: boolean;
    isCenter?: boolean
}

const H:FC<Props> = ({ children, isBack = true, isCenter = false }) => {
    const navigate = useNavigate();
  return (
    <>
    <header style={isCenter ? {justifyContent: 'center'} : {justifyContent: 'start'}} id='header'>
        {
            isBack ?
            <img onClick={() => navigate(-1)} src={back} alt="Назад" />
            :
            <img onClick={() => navigate('/')} src={back} alt="Назад" />
        }
        
        <h1>{children}</h1>
    </header>
    </>
  )
}

export default H;