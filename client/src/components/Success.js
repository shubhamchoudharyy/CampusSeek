import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import {host} from '../assets/APIRoute'
import { message } from 'antd';
const Success = () => {

  const {user}=useSelector((state)=>state.user)
  const navigate=useNavigate();

  useEffect(()=>{
    const update=async()=>{
      try{
        const res=await axios.post(`${host}/college/success`,{
          userId:user?._id
        });
        if(res.data.success){
          message.success("Premium buyied successfully")
          window.location.reload();
          navigate('/');

        }else{
          message.error("Something error occured");
        }
      }
      catch(error){
        console.log(error)
      }
    }
    update();
  },[user])
  return (
    <div>
      <p>Your transcation is Successfull</p>
      <p>Redirect to <Link to="/">home</Link> page</p>

    </div>
  )
}

export default Success
