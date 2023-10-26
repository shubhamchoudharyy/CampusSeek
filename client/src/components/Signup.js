import React ,{useState}from 'react'
import { app, provider } from '../firebase';
import styled from 'styled-components';
import { getAuth, createUserWithEmailAndPassword,signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import {Form,Spin,message} from 'antd'
import { host } from '../assets/APIRoute';

const Signup = () => {

    const dispatch=useDispatch()
    const navigate=useNavigate()
  

    const [load,setLoad]=useState(false);

    const onfinishHandler=async(values)=>{
        try{
            setLoad(true)
            dispatch(showLoading())
            const res=await axios.post(`${host}/user/register`,values);
            dispatch(hideLoading())
            if(res.data.success){
                setLoad(false)
                message.success('Register Successfully')
                
                navigate('/login')
            }else{
                message.error(res.data.message)
                setLoad(false)
            }

        }catch(error){
            setLoad(false)
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
    
   
    <Form layout='vertical' onFinish={onfinishHandler} >
    <Photo><img src='/images/logo.png' alt='img'/></Photo>
    <h1 style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>Welcome to Campus Seek</h1>
    <Head>
        <p style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}} >Sign Up to Get Started</p>
        
        <p>If applying for College/University account go on My Profile section after Signup</p>
        </Head>
    
    <Cred>
    <Form.Item label='' name='name'>
    <input type="text" name="name" id="" placeholder='Name'  required />
    </Form.Item>

    <Form.Item label='' name='email'>
    <input type="email" name="email" id="" placeholder='Email Address'  required />
    </Form.Item>

    <Form.Item label='' name='phone'>
    <input type="number" name="phone" id="" placeholder='Phone No'  required />
    </Form.Item>
    
    {/* <Form.Item label='' name='location'>
    <input type="password" name="location" id="" placeholder='Location' required />
    </Form.Item> */}

    <Form.Item label='' name='password'>
    <input type="password" name="password" id="" placeholder='Password' required />
    </Form.Item>
    
    {load? <button className='active' ><Spin/></button>:<button ><span>Sign Up</span></button>}
    <p>Already a user? <Link to='/login'>Login</Link></p>
    </Cred>

    
    <Horizontal>
    <hr />
    <span>or</span>
    <hr />
    </Horizontal>
    <Button>
    <button className='btn' onClick={(e)=>handleGoogle(e)}>
        <img src="/images/google.svg" alt="Google Logo" />
        <span>Sign In With Google</span>
    </button>
    </Button>
    </Form>
    
</Container>
  )
}

const Container=styled.div`
     width: 100vw;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: wrap;
`;
// const Form=styled.form`

// `;

const Photo = styled.div`
width:100%;
display: flex;
justify-content: center;
align-items: center;
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
    margin: -30px auto 12px;
    border-radius: 50%;
  }
`;

const Head=styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p{
        font-weight: 400;
        font-size: 1.2rem;
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
    margin-right:28%;
    margin-left: 28%;
    /* background-color: red; */
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
        margin-top: auto;
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

export default Signup
