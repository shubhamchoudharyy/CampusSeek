import React ,{useState,useEffect}from 'react'
import { app } from '../firebase';
import styled from 'styled-components';
import { getAuth, createUserWithEmailAndPassword,signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import {Form,message} from 'antd'
import { host } from '../assets/APIRoute';

const CollegeSignup2 = () => {
    const {user}=useSelector((state)=>state.user);
    const dispatch=useDispatch()
    const navigate=useNavigate()
    


    useEffect(() => {
      if (!localStorage.getItem('token')) {
        // Redirect to the login page if there's no token or user data
        navigate('/login');
      }
    }, [user, navigate]);
    useEffect(()=>{
      if(user?.phone===0){
        navigate('/complete-login')
      }
    },[user,navigate])
    const handleFinish = async (values) => {
        try {
          dispatch(showLoading());
      
          // Check if user is available before accessing _id
          if (user) {
            const res = await axios.post(
              `${host}/user/apply-college`,
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
   
    </Cred>

    
  
   
    </Form>
    
</Container>
  )
}

const Container=styled.div`
    grid-area: main;
`;


const Head = styled.div`
 
 width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
          justify-content: center;
  p {
    font-weight: 400;
    font-size: 1.2rem;
  }
`;


const Cred = styled.div`
 
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
  input {
    width: 300px;
    height: 52px;
    margin: 8px;
  }
  .uppercase-input {
  text-transform: uppercase;
}

  button {
    width: 300px;
    height: 45px;
    background-color: #0a66c2;
    color: #fff;
    margin: 8px;
    border: 0px;
    border-radius: 3px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0a55b3;
  }
  button span {
    font-size: 1rem;
    font-weight: 600;
  }
`;

export default CollegeSignup2;
