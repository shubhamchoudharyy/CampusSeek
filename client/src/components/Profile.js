import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, message, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { host } from '../assets/APIRoute';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [values, setValues] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imageSelected, setImageSelected] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [newPhotoUrl, setNewPhotoUrl] = useState('');
//   const [showUploadAndPostButton, setShowUploadAndPostButton] = useState(true);
//   const [showCrossButton, setShowCrossButton] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [user, navigate]);
  useEffect(()=>{
    if(user?.phone===0){
      navigate('/complete-login')
    }
  },[user,navigate])



  

  

  useEffect(() => {
    const getUserInfo = async () => {
        try {
          const res = await axios.post(
            `${host}/user/info/${params.id}`,
          
            // {
            //   headers: {
            //     Authorization: `Bearer ${localStorage.getItem('token')}`,
            //   },
            // }
          );
          if (res.data.success) {
            setValues(res.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
    getUserInfo();
  }, [params.id]);
  console.log(values);
  if(!values){
    return <Spin style={{marginTop:'12px'}}/>
  }

  const handleVerify = async () => {
    try {
      const res = await axios.post(`${host}/admin/verify/${params.id}`);
      if (res.data.success) {
        message.success("Changed");
        // Update the local state with the new values returned from the API
        setValues((prevValues) => ({ ...prevValues, verified: !prevValues.verified }));
      } else {
        message.error("Some error occurred");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handlePremium = async () => {
    try {
      const res = await axios.post(`${host}/admin/premium/${params.id}`);
      if (res.data.success) {
        message.success("Changed");
        // Update the local state with the new values returned from the API
        setValues((prevValues) => ({ ...prevValues, premium: !prevValues.premium }));
      } else {
        message.error("Some Error occurred");
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <Container>
      <Layout>
        <UserInfo>
          <CardBackground />
          <a>
            <Photo style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
              {values.photoUrl?
              <img src={values.photoUrl}/> :
              <img src='/images/photo.svg'/>}
            </Photo>
            <Links style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>{values.name}</Links>
          </a>
          <a>
            <AddPhotoText>
              
            </AddPhotoText>
          </a>
        </UserInfo>
        <Cred>
          <fieldset>
            <legend>About</legend>
            
                <Form layout="vertical" initialValues={{ ...values }}>
                <About>
                    <Form.Item
                    label={<span className="form-label">Name</span>}
                    name="name"
                    required
                    rules={{ required: true }}
                    >
                    <Input type="text" name="name" disabled placeholder={values.name} id="" />
                    <br />
                    </Form.Item>

                    <Form.Item
                    label={<span className="form-label">Email</span>}
                    name="email"
                    required
                    rules={{ required: true }}
                    >
                    <Input type="email" name="email" placeholder={values.email} disabled id="" />
                    <br />
                    </Form.Item>

                    <Form.Item label={<span className="form-label">Phone</span>} name="phone">
                    <Input
                        type="number"
                        name="phone"
                        disabled
                        placeholder={values.phone}
                        id=""
                    />
                    <br />
                    </Form.Item >
                    
                </About>
                </Form>
          </fieldset>
         
        </Cred>
        <Verify>
          <div>
            <p>Verified</p>
            <p>{values.verified ? <span>True</span> : <span>False</span>}</p>
            {values.verified? <button onClick={handleVerify}><span>False</span></button> : <button onClick={handleVerify}><span>True</span></button>}
          </div>
          <div>
            <p>Premium</p>
            <p>{values.premium? <span>True</span>:<span>False</span>}</p>
            {values.premium? <button onClick={handlePremium}><span>False</span></button> : <button onClick={handlePremium}><span>True</span></button>}
          </div>

        </Verify>
      </Layout>
    </Container>
  );
};
const CrossButton = styled.button`
  background-color: transparent;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  /* &:hover {
    background-color: #cc0000;
  } */

  &:focus {
    outline: none;
  }
`;

const Container = styled.div`
  grid-area: main;
`;
const Layout = styled.div`
  background-color: #ffff;
  display: flex;
  height: 100%;
  border-radius: 5px;
  flex-direction: column;
  box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0 ,0 0 0 rgba(0 0 0/15%);
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  background-color: #007bff;
  /* Button background color */
  color: #fff;
  /* Text color */
  padding: 10px 20px;
  /* Padding for the button */
  border: none;
  /* No border */
  border-radius: 5px;
  /* Rounded corners */
  cursor: pointer;
  /* Cursor style on hover */

  /* Additional CSS styles for hover and focus states */
  &:hover {
    background-color: #0056b3;
    /* Button background color on hover */
  }

  &:focus {
    outline: none;
    /* Remove focus outline */
  }
`;
const UserInfo = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding: 12px 12px 16px;
  word-wrap: break-word;
  word-break: break-word;
  width: 100%;
`;

const CardBackground = styled.div`
  background: url("/images/card-bg.svg");
  background-position: center;
  background-size: 462px;
  height: 54px;
  max-width: 100%;
  margin: -12px -12px 0;
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

const EditButton = styled.button`
  background-color: #0a66c2; /* Button background color */
  color: #fff; /* Text color */
  padding: 8px 16px; /* Padding for the button */
  border: none; /* No border */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Cursor style on hover */

  /* Additional CSS styles for hover and focus states */
  &:hover {
    background-color: #004080; /* Button background color on hover */
  }

  &:focus {
    outline: none; /* Remove focus outline */
  }
`;

const Links = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0, 9);
  font-weight: 600;
`;

const AddPhotoText = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
`;

const Cred = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0 ,0 0 0 rgba(0 0 0/15%);
  
  fieldset {
    border: 0;
    border-radius: 5px;
    box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0 ,0 0 0 rgba(0 0 0/15%);
    width: 90%;
  }
  legend {
    font-weight: 600;
  }
`;

const About = styled.form`
  textarea,input{
    height:40px;
    margin:10px;
    width:80%;
    border-top:0;
    border-left: 0;
    border-right: 0;
  }
  input::placeholder{
    color:black;
    font-size: 1rem;
  }
`;

const Verify=styled.div`
  display: flex;
  flex-direction: column;
  div{
    display: flex;
    justify-content: space-around;
    align-items: center;
    button{
    cursor:pointer;
        width:80px;
        height:20px;
        background-color:#0a66c2;
        border:0;
        border-radius: 20px;
        span{
            color:white;
            font-weight:600;
        }
    }
    button:hover{
        background-color: #0a55c3;
    }
  }

`;

export default Profile;
