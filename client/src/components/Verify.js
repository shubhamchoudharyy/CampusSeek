import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import { message } from 'antd';
import { host } from '../assets/APIRoute';


const Verify = () => {
    const dispatch=useDispatch();
   const params=useParams();
   
    let token=""
    
    // Get the current URL
    const currentURL = window.location.href;

    // Split the URL by "/"
    const parts = currentURL.split("/");

    // Find the index of "reset-password" in the path
    const resetPasswordIndex = parts.indexOf("verify");

    // Check if "reset-password" is found in the path
    if (resetPasswordIndex !== -1) {
    // Get the string following "reset-password" (in this case, it will be the token)
    token = parts[resetPasswordIndex + 1];
    
    console.log("Token:", token);

    // Now, 'token' contains the value you want.
    } else {
    // console.log("Reset password token not found in the URL.");
    }

    useEffect(()=>{
        const update=async()=>{
            try{
                dispatch(showLoading())
                const res=await axios.post(`${host}/user/verify`,{
                    userId:token
                })
                dispatch(hideLoading())
                if(res.data.success){
                    message.success(res.data.message);
                }else{
                    message.error(res.data.message)
                }
            }catch(error){
                dispatch(hideLoading())
                console.log(error)
                message.error('Something went Wrong')
              }
        }
        update();


    },[]);
  return (
    <Container>
      <Content>
        <div>
        <img src='/images/logo.png' alt="verified"/>
        <p>Campus Seek</p>
        </div>
        <div>
        <h1>Your Account is verified</h1>
        <p>Now You can Login by <Link to='/login'> clicking here </Link></p>
        </div>
      </Content>
    </Container>
  )
}

const Container=styled.div`
    
height: 100vh;
    width: 100vw;
    margin: 0;
    -webkit-box-align: center;
    -ms-flex-align: center;
            align-items: center;
`;

const Content=styled.div`
  
  border: 1px solid;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
        justify-content: space-around;
    -webkit-box-align: center;
    -ms-flex-align: center;
            align-items: center;
    height: 200px;
    width: 70%;
    margin: auto;
    margin-top:50px ;
    img{
        height: 120px;
        width: 120px;
    }
    p{
        font-weight: 600;
    }

`;
export default Verify
