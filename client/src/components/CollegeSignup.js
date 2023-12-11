import React ,{useEffect, useState}from 'react'
import { app } from '../firebase';
import styled from 'styled-components';
import { getAuth, createUserWithEmailAndPassword,signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import {Form,Spin,message} from 'antd'
import { host } from '../assets/APIRoute';

const CollegeSignup = () => {
    const { user } = useSelector((state) => state.user);
  const [initialValues, setInitialValues] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
 


console.log(user);
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
                photoUrl:initialValues.photoUrl,
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
      
      
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await axios.post(
          `${host}/user/getUserInfo`,
          { userId: params.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (res.data.success) {
          setInitialValues(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserInfo();
  }, [params.id]); // Make sure to include params.id as a dependency

  // Conditional rendering based on whether initialValues is set
  if (!initialValues) {
    return <Spin style={{marginTop:'12px'}}/>; // or any loading indicator
  }
      
  return (
    <Container>
        <Layout>
      <Form layout="vertical" onFinish={handleFinish} initialValues={{...initialValues}}>
    
        <Head>
          <p>Enter College Details</p>
        </Head>

        <Cred>
          <Form.Item label="" name="name">
            <input type="text" name="name" id="" disabled placeholder="College Name" required />
          </Form.Item>

          <Form.Item label="" name="email">
            <input type="email" name="email" id="" disabled placeholder="College Email Address" required />
          </Form.Item>

          <Form.Item label="" name="phone">
            <input type="number" name="phone" id=""  disabled placeholder="Phone No" required />
          </Form.Item>

          <Form.Item label="" name="location" >
            <input type="text" name="location" id=""   placeholder="Address" required />
          </Form.Item>
          <Form.Item label="" name="district">
            <input type="text" name="district" id=""   placeholder="District" required />
          </Form.Item>
          <Form.Item label="" name="state">
            <input type="text" name="state" id=""  placeholder="State" required />
          </Form.Item>
          <Form.Item label="" name="country">
            <input type="text" name="country" id=""  placeholder="Country" required />
          </Form.Item>
          <Form.Item label="" name="website">
            <input type="text" name="website" id="" placeholder="Website"  />
          </Form.Item>

          <button>
            <span>Submit</span>
          </button>
          <p>
            {/* Already a user? <Link to="/login">Login</Link> */}
          </p>
        </Cred>
      </Form>
      </Layout>
    </Container>
  );
};

const Container=styled.div`
    grid-area: main;
    margin:8px;
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

const Layout=styled.div`
   
 width:90%;
    height: -webkit-fit-content;
    height: -moz-fit-content;
    height: fit-content;
    padding: 10px;
    -webkit-box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
            box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
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
    height: 30px;
    margin: 3px;
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

export default CollegeSignup;
