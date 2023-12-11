import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app, provider } from '../firebase';
import { host } from '../assets/APIRoute';
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

 
    const onfinishHandler=async(values)=>{
        
        try{
          console.log(values)
          dispatch(showLoading())
          const res=await axios.post(`${host}/user/login`,values)
          window.location.reload()
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


const auth = getAuth();

const GoogleSignIn=async(values)=>{
    try{
        dispatch(showLoading())
        const res=await axios.post(`${host}/user/google-login`,values)
        window.location.reload()
        dispatch(hideLoading())
        if(res.data.success){
            localStorage.setItem('token',res.data.token)
            if(res.data.data.phone!==0){
                message.success('Login Succesfully')
                navigate('/');
            } else{
                navigate('/complete-login')
            }          
          }else{
            message.error(res.data.message)
          }
        }catch(error){
            dispatch(hideLoading())
            console.log(error)
            message.error('Something went Wrong')
          }
}

const handleGoogle=async(e)=>{
    e.preventDefault();
    signInWithPopup(auth,provider)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const payload = result.user;
        console.log(payload)
        GoogleSignIn(payload);

      })
      .catch((error) => alert(error.message));
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
                    
                    <p>Forgot Password ?<Link to='/forgot-password'>Click here</Link></p>
                
                <Horizontal>
                    <hr/>
                    <span>or</span>
                    <hr/>
                </Horizontal>
                <Button>
                <button className='btn' onClick={(e)=>handleGoogle(e)}>
                    <img src="/images/google.svg" alt="Google Logo" />
                    <span>Sign In With Google</span>
                </button>
                </Button>
                </Cred>
            </Form>
        </Container>
    );
};



const Container=styled.div`

width: 100vw;
height: 100vh;
display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-align: center;
-ms-flex-align: center;
        align-items: center;
-webkit-box-pack: center;
-ms-flex-pack: center;
        justify-content: center;
-webkit-box-orient: vertical;
-webkit-box-direction: normal;
-ms-flex-direction: column;
        flex-direction: column;
-ms-flex-wrap: wrap;
    flex-wrap: wrap;
h1,p{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
-webkit-box-align: center;
    -ms-flex-align: center;
        align-items: center;
-webkit-box-pack: center;
    -ms-flex-pack: center;
        justify-content: center;
width: 100%;

}

`;
// const Form=styled.form`

// `;

const Head=styled.div`

width: 100%;
display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-pack: center;
-ms-flex-pack: center;
        justify-content: center;
p{
font-weight: 400;
font-size: 1.2rem;
}

`;
const Photo = styled.div`

display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-align: center;
-ms-flex-align: center;
        align-items: center;
-webkit-box-pack: center;
-ms-flex-pack: center;
        justify-content: center;
width: 100%;
-webkit-box-orient: vertical;
-webkit-box-direction: normal;
-ms-flex-direction: column;
        flex-direction: column;
img {
-webkit-box-shadow: none;
        box-shadow: none;
/* background-image: url("/images/photo.svg"); */
width: 72px;
height: 72px;
-webkit-box-sizing: border-box;
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

display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-align: center;
-ms-flex-align: center;
        align-items: center;
-webkit-box-pack: center;
-ms-flex-pack: center;
        justify-content: center;
-webkit-box-orient: vertical;
-webkit-box-direction: normal;
-ms-flex-direction: column;
        flex-direction: column;
-ms-flex-wrap: wrap;
    flex-wrap: wrap;
input{
width: 300px;
height: 40px;
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
   
 display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
            flex-direction: row;
    -ms-flex-wrap: wrap;
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
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        border: 1px solid black;
        -ms-flex-pack: distribute;
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
export default Login;
