import React, { useState } from 'react';
import styled from 'styled-components'
import axios from 'axios'
import { Form,Spin,message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import { useDispatch, useSelector } from 'react-redux';
import { host } from '../assets/APIRoute';


const ForgotPassword = () => {
    const dispatch=useDispatch();
   const [load,setLoad]=useState(false)
    const navigate=useNavigate();

    
    const onfinishHandler=async(values)=>{
        
        try{
            setLoad(true)
          dispatch(showLoading())
          const res=await axios.post(`${host}/user/forget-password`,{
            email:values.email
          })
        //   window.location.reload()
          dispatch(hideLoading())
          if(res.data.success){
          
           setLoad(false);
            message.success('An mail has been sent to your mail')
            navigate('/login');
            
            
          }else{
            message.error(res.data.message)
            setLoad(false);
          }
        }catch(error){
            setLoad(false);
          dispatch(hideLoading())
          console.log(error)
          message.error('Something went Wrong')
        }
    }
    
  return (
    <Container>
            <Form onFinish={onfinishHandler} layout='vertical' >
                <Photo><img src='/images/logo.png'/></Photo>
                <h1>Forgot Password</h1>
                <Head>
                    <p>Enter Your Email Address</p>
                </Head>
                <Cred>
                    <Form.Item label='' name='email'>
                    <input type="email" name="email" placeholder='Email Address'  />
                    </Form.Item>
                   
                    {load? <button className='active' ><Spin/></button>:<button ><span>Submit</span></button>}
                   
                </Cred>
            </Form>
        </Container>
    );
};


const Container=styled.div`
     width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: wrap;
`;
// const Form=styled.form`

// `;

const Head=styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    p{
        font-weight: 400;
        font-size: 1.2rem;
    }

`;
const Photo = styled.div`
  img {
    box-shadow: none;
    /* background-image: url("/images/photo.svg"); */
    width: 72px;
    height: 72px;
    box-sizing: border-box;
    background-clip: content-box;
    background-color: white;
    background-position: center;
    background-size: 60%;
    background-repeat: no-repeat;
    border: 2px solid white;
    margin: -38px auto 12px;
    border-radius: 50%;
  }
`;

const Cred=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: wrap;
    input{
        width: 300px;
        height: 52px;
        margin: 8px;
    }

    button{
        width: 300px;
        height: 45px;
        background-color: #0A66C2;
        color: #fff;
        margin: 8px;
        border: 0px;
        border-radius: 3px;
        cursor: pointer;
        }
    button:hover{
        background-color: #0A55B3;
    }
    button span{
        font-size: 1rem;
        font-weight: 600;
    }
    .active{
        background-color: rgba(0,0,0,0.08);
    }
    .active:hover{
        background-color: rgba(0,0,0,0.08);

    }
`;

const Horizontal=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;

    hr{
        width: 40%;
        display: inline;
        /* border: 1px solid; */
        height: 0;
    }
    span{
        margin:2px ;
    }
`;

const Button=styled.div`
    button{
        width: 300px;
        height: 45px;
        background:transparent;
        color: black;
        margin: 8px;
        cursor: pointer;
        display: flex;
        border: 1px solid black;
        justify-content: space-around;
        margin-top: 40px;
        margin-left: auto;
    }
    button:hover{
        background-color: rgba(0,0,0,0.07);
    }
    button span{
        font-size: 1rem;
        font-weight: 400;
        padding-top:10px;
    }
    button img{
        height: 30px;
        padding-top:5px ;
    }
`;

export default ForgotPassword
