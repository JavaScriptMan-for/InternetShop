import { FC } from "react";
import { useSelector } from "react-redux";

import SendToEmail from "@components/SendToEmail";
import PutPassword from "@components/PutPassword";

import { RootState } from "store/store";

const FagotPassword:FC = () => {
  const isSend = useSelector((state: RootState) => state.additionally.isSend);
  return (
    <>
    {
      !isSend ?
      <SendToEmail /> :
      <PutPassword />
    }
    </>
  )
}

export default FagotPassword;