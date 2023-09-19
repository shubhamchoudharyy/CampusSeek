import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from '../firebase';

import { connect } from 'react-redux';
import styled from 'styled-components';
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {showLoading,hideLoading} from '../redux/features/alertSlice'
import axios from 'axios'
import {Form,message} from 'antd'

const Login = (props) => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {user}=useSelector((state)=>state.user)

    const baseURL = "http://localhost:5000/api/v1"; // Example base URL
    const onfinishHandler=async(values)=>{
        console.log(values);
        try{
          console.log(values)
          dispatch(showLoading())
          const res=await axios.post(`${baseURL}/user/login`,values)
        //   window.location.reload()
          dispatch(hideLoading())
          if(res.data.success){
            localStorage.setItem('token',res.data.token)
           
            message.success('Login Succesfully')
            navigate('/');
            
            
          }else{
            message.error(res.data.message)
          }
        }catch(error){
          dispatch(hideLoading())
          console.log(error)
          message.error('Something went Wrong')
        }
    }
    
const handleClick=(values)=>{
    console.log(values);
}
   

    return (
        <Container>
            <Form onFinish={onfinishHandler} layout='vertical' >
                <Photo><img src='/images/logo.png'/></Photo>
                <h1>Welcome to Campus Seek</h1>
                <Head>
                    <p>Login to Get Started</p>
                </Head>
                <Cred>
                    <Form.Item label='' name='email'>
                    <input type="email" name="email" placeholder='Email Address'  />
                    </Form.Item>
                    <Form.Item label='' name='password'>
                    <input type="password" name="password" placeholder='Password' />
                    </Form.Item>
                    <button ><span>Login</span></button>
                    <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
                    <hr />
                    {/* <p>Register as a College/University ?<Link to='/college-signup'>Click here</Link></p>
                
                <Horizontal>
                    <hr />
                    <span>or</span>
                    <hr />
                </Horizontal>
                <Button>
                <button className='btn' onClick={(e)=>{e.preventDefault(); handleClick()}}>
                    <img src="/images/google.svg" alt="Google Logo" />
                    <span>Sign In With Google</span>
                </button>
                </Button> */}
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
`;

const Horizontal=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;

    hr{
        width: 40%;
        display: inline;
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
        margin-left: 50px;
    }
    button:hover{
        background-color: rgba(0,0,0,0.07);
    }
    button span{
        font-size: 1rem;
        padding-top:10px;
    }
    button img{
        height: 30px;
        padding-top:5px ;
    }
`;
// const mapStateToProps=(state)=>{
//     return{
//         user:state.userState.user,
//     }
// }

// const mapDispatchToProps=(dispatch)=>{
//     return{
//         signIn:()=> dispatch(signInAPI()),
//     }
// }

// export default connect(mapStateToProps,mapDispatchToProps)(Login);
export default Login;
