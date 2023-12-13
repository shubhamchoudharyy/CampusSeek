import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import { useDispatch,useSelector } from 'react-redux';
import { Form,message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { host } from '../assets/APIRoute';

const CompleteLogin = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate();
    const {user}=useSelector((state)=>state.user);

    const [load, setLoad] = useState(false);
    const [passwordCriteriaError, setPasswordCriteriaError] = useState('');
    const [validPasswordMessage, setValidPasswordMessage] = useState('');

    const isPasswordValid = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
        const isLengthValid = password.length >= 8;
    
        if (
          hasUpperCase &&
          hasLowerCase &&
          hasNumber &&
          hasSpecialCharacter &&
          isLengthValid
        ) {
          setValidPasswordMessage('Valid password');
          setPasswordCriteriaError(''); // Clear any previous error message
          return true;
        } else {
          const errors = [];
          if (!hasUpperCase) errors.push('uppercase letter');
          if (!hasLowerCase) errors.push('lowercase letter');
          if (!hasNumber) errors.push('number');
          if (!hasSpecialCharacter) errors.push('special character');
          if (!isLengthValid) errors.push('at least 8 characters');
    
          setValidPasswordMessage('');
          setPasswordCriteriaError(`Password should contain ${errors.join(', ')}.`);
          return false;
        }
      };
      const onfinishHandler = async (values) => {
        try {
          setLoad(true);
          dispatch(showLoading());
    
          // Validate password criteria
          if (!isPasswordValid(values.password)) {
            setLoad(false);
            dispatch(hideLoading());
            return;
          }
    
          const res=await axios.post(`${host}/user/setPhone`,{
            phone:values.phone, password:values.password  ,userId:user._id
          },{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          }
          )
          window.location.reload()
          dispatch(hideLoading())
          if(res.data.success){
            message.success('Login Succesfully')
            navigate('/');
          }
        }catch(error){
          dispatch(hideLoading())
          console.log(error)
          message.error('Something went Wrong')
        }
    }

    useEffect(()=>{
      if(user?.phone!==0){
              navigate('/');
      }
  },[user]);
  return (
    <Container>
    <Form onFinish={onfinishHandler} layout='vertical' >
        <Photo><img src='/images/logo.png'/></Photo>
        <h1>Enter Further Details</h1>
        <Head>
            <p>Enter Phone Number and Set a Password</p>
        </Head>
        <Cred>
            <Form.Item label='' name='phone'>
            <input type="number" name="phone" placeholder='Phone Number'  required />
            </Form.Item>
            <Form.Item
            label=""
            name="password"
            rules={[
              {
                validator: async (_, value) => {
                  if (isPasswordValid(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Invalid password');
                },
              },
            ]}
          >
            <input
              type="password"
              name="password"
              id=""
              placeholder="Password"
              required
            />
          </Form.Item>
          {passwordCriteriaError && <p className='error'>{passwordCriteriaError}</p>}
          {validPasswordMessage && <p className='error'>{validPasswordMessage}</p>}
            <button ><span>Submit</span></button>
            
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


export default CompleteLogin
