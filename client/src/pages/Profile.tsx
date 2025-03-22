import { FC } from 'react';
import My_products from '../components/My_products'
import User_info from '../components/User_info';

const Profile:FC = () => {
  return (
    <div id='profile'>
    <User_info />
    <My_products />
    </div>
  )
}

export default Profile;