import { FC, ReactNode } from 'react';

interface PanelProps {
    children: ReactNode
}
const Panel:FC<PanelProps> = ({children}) => {
  return (
    <div id='panel'>
        <h2>Категории:</h2>
        {children}
    </div>
  )
}

export default Panel;