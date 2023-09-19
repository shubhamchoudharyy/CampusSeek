import React ,{useState}from 'react'
import { app } from '../firebase';
import styled from 'styled-components';
import { getAuth, createUserWithEmailAndPassword,signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import {Form,message} from 'antd'

const CollegeSignup2 = () => {
    const {user}=useSelector((state)=>state.user);
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const baseURL = "http://localhost:5000/api/v1"; // Example base URL


console.log(user);
    const handleFinish = async (values) => {
        try {
          dispatch(showLoading());
      
          // Check if user is available before accessing _id
          if (user) {
            const res = await axios.post(
              `${baseURL}/user/apply-college`,
              {
                ...values,
                userId: user._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
      
            dispatch(hideLoading());
      
            if (res.data.success) {
              message.success(res.data.message);
              navigate('/');
            } else {
              message.error(res.data.message);
            }
          } else {
            // Handle the case where user is null or undefined
            message.error('User not found. Please log in again.');
          }
        } catch (error) {
          dispatch(hideLoading());
          console.log(error);
          message.error('Something went wrong');
        }
      };
      
  return (
    <Container>
    <Form layout='vertical' onFinish={handleFinish}>
    <h1>Welcome to Campus Seek</h1>
    <Head>
        <p >Enter Details</p>
        </Head>
    
    <Cred>
    <Form.Item label='' name='name'>
    <input type="text" name="name" id="" placeholder='Enter full college name'  required />
    </Form.Item>

    <Form.Item label='' name='email'>
    <input type="email" name="email" id="" placeholder='Enter College Email Address'  required />
    </Form.Item>

    <Form.Item label='' name='phone'>
    <input type="number" name="phone" id="" placeholder='Phone No'  required />
    </Form.Item>
    
    <Form.Item label='' name='location'>
    <input type="text" name="location" id="" placeholder='Location' required />
    </Form.Item>

    <Form.Item label='' name='website'>
    <input type="text" name="website" id="" placeholder='Website'  />
    </Form.Item>

    
  
    <button ><span>Submit</span></button>
    {/* <p>Already a user? <Link to='/login'>Login</Link></p> */}
    </Cred>

    
    {/* <Horizontal>
    <hr />
    <span>or</span>
    <hr />
    </Horizontal>
    <Button>
    <button className='btn' >
        <img src="/images/google.svg"/>
        <span>Sign Up With Google</span>
    </button>
    </Button> */}
    </Form>
    
</Container>
  )
}

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

export default CollegeSignup2;
