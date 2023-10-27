import React from 'react';
import styled from 'styled-components'
import axios from 'axios'
import { Form,message } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import { useDispatch, useSelector } from 'react-redux';
import { host } from '../assets/APIRoute';


const ResetPassword = () => {
    const dispatch=useDispatch();
   const params=useParams();
    const navigate=useNavigate();
    let token=""
    


    // Get the current URL
    const currentURL = window.location.href;

    // Split the URL by "/"
    const parts = currentURL.split("/");

    // Find the index of "reset-password" in the path
    const resetPasswordIndex = parts.indexOf("reset-password");

    // Check if "reset-password" is found in the path
    if (resetPasswordIndex !== -1) {
    // Get the string following "reset-password" (in this case, it will be the token)
    token = parts[resetPasswordIndex + 1];
    
    // console.log("Token:", token);

    // Now, 'token' contains the value you want.
    } else {
    // console.log("Reset password token not found in the URL.");
    }


    const onfinishHandler=async(values)=>{
        console.log(values);
        console.log(params.id)
        try{
          console.log(values)
          dispatch(showLoading())
          const res=await axios.post(`${host}/user/reset-password`,{
            password:values.password,userId:token
          })
        //   window.location.reload()
          dispatch(hideLoading())
          if(res.data.success){ 
            message.success('An mail has been sent to your mail')
            navigate('/login');
            
            
          }else{
            message.error(res.data.message)
          }
        }catch(error){
          dispatch(hideLoading())
          console.log(error)
          message.error('Something went Wrong')
        }
    }
    
  return (
    <Container>
            <Form onFinish={onfinishHandler} layout='vertical' >
                <Photo><img src='/images/logo.png'/></Photo>
                <h1>Reset Password</h1>
                <Head>
                    <p>Enter New Password</p>
                </Head>
                <Cred>
                    <Form.Item label='' name='password'>
                    <input type="password" name="Password" placeholder='New Password'  />
                    </Form.Item>
                   
                    <button ><span>Update</span></button>
                   
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
export default ResetPassword
