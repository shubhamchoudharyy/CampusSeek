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
    
   
    <Form layout='vertical' onFinish={onfinishHandler} >
    <Photo><img src='/images/logo.png' alt='img'/></Photo>
    <h1 >Welcome to Campus Seek</h1>
    <Head>
        <p  >Sign Up to Get Started</p>
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
    <span>If applying for College/University account go on My Profile section after Signup</span>
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
margin: 1px;
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
margin: -8px auto 12px;
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
margin: 2px;
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
span{
    font-size: 0.7rem;
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
    margin: 0;
`;

const Button=styled.div`
width: 100%;

display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-align: center;
-ms-flex-align: center;
        align-items: center;
-webkit-box-pack: center;
-ms-flex-pack: center;
        justify-content: center;
   
 button{
        width: 300px;
        height: 45px;
        background:transparent;
        color: black;
        margin: 0px;
        cursor: pointer;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        border: 1px solid black;
        -ms-flex-pack: distribute;
            justify-content: space-around;
        margin-top: 40px;
        
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
