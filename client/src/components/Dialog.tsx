import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
interface DialogProps {
    children: ReactNode;
    header: string;
    show: boolean;
    isHave: boolean;
    isCenter?: boolean
}

const Dialog:FC<DialogProps> = ({children, header, show, isHave, isCenter}) => {

  return (
    <dialog style={isCenter ? {marginLeft: '30%', marginTop: "20%"} : {}} open={show}>
       <div className='dialog-content'>
            <h1>{header}</h1>
            {children}
        {isHave && <Link to="">Закрыть</Link>}
       </div>
    </dialog>
  )
}

export default Dialog;