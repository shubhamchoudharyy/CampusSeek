import React, { useState, useEffect } from 'react';

import { Form, Row, Col, Input, message,Spin } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import { useParams } from 'react-router-dom';
import styled from 'styled-components'
import { host } from '../../assets/APIRoute';
const ProfileAdmin = () => {
    const { user } = useSelector((state) => state.user);
    const [initialValues, setInitialValues] = useState(null);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [showUploadAndPostButton, setShowUploadAndPostButton] = useState(true);
  const [showCrossButton, setShowCrossButton] = useState(false);

    

    useEffect(() => {
        if (!localStorage.getItem('token') ) {
          // Redirect to the login page if there's no token or user data
          navigate('/login');
        }
      }, [user, navigate]);
      useEffect(()=>{
        if(user?.phone===0){
          navigate('/complete-login')
        }
      },[user,navigate])

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
      console.log(initialValues);
      useEffect(() => {
        getUserInfo();
      }, []);

      const handleChange = (e) => {
        const image = e.target.files[0];
        if (image === '' || image === undefined) {
          alert(`Not an image, the file is a ${typeof image}`);
          return;
        }
        setSelectedImage(image);
        setImageSelected(true);
        setShowUploadAndPostButton(true);
        setShowCrossButton(true);
      };
    
      const handleUploadAndPost = async () => {
        try {
          if (selectedImage) {
            setUploading(true);
            const formData = new FormData();
            formData.append('fieldname', selectedImage);
      
            const res = await axios.post(`${host}/user/Url`, formData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
              },
            });
      
            if (res.data.success) {
              setNewPhotoUrl(res.data.data);
              setUploading(false);
              setShowCrossButton(false);
              setSelectedImage(null);
              setImageSelected(false);
              setShowUploadAndPostButton(false);
      
              // After successfully uploading the image, update the profile photo in the backend
              await updateProfilePhoto(res.data.data);
            }
          }
        } catch (error) {
          console.error(error);
          setUploading(false);
        }
      };
    
      const handleResetImage = () => {
        setSelectedImage(null);
        setImageSelected(false);
        setShowUploadAndPostButton(true);
        setShowCrossButton(false);
      };
    
      const updateProfilePhoto = async (photoUrl) => {
        try {
          const res = await axios.post(
            `${host}/user/photo`,
            { userId: params.id, photo: photoUrl },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
      
          if (res.data.success) {
            message.success(res.data.message);
            setImageSelected(false);
          }
        } catch (error) {
          console.log(error);
        }
      };
    
  return (
    <Container>
    <Layout>
    <UserInfo>
      <CardBackground/>
          <a>
          <Photo >
              <img src={newPhotoUrl || user?.photoUrl} alt='user' />
              {imageSelected && showUploadAndPostButton && (
                <ButtonsContainer>
                  {/* <Button onClick={handleChange}>Upload Image</Button> */}
                  <Button onClick={handleUploadAndPost}>Upload and Post</Button>
                  {showCrossButton && (
                    <CrossButton onClick={handleResetImage}>❌</CrossButton>
                  )}
                </ButtonsContainer>
              )}
              {uploading && <Spin style={{ marginTop: '12px' }} />}
            </Photo>
              <Link >{user?user.name :'user' }</Link>
          </a>
          <a>
          <AddPhotoText >
              <label htmlFor="photoUpload">Edit Photo</label>
              <input
                type="file"
                name="photoUrl"
                accept="image/*" 
                id="photoUpload"
                style={{ display: 'none' }}
                onChange={handleChange}
              />
            </AddPhotoText>
          </a>
         
  </UserInfo>
  <Cred>
  <fieldset>
  <legend>About</legend>
  <Form layout='vertical' initialValues={{...initialValues}}>
    <About>
        <Form.Item label={<span className='form-label'>Name</span>} name="name"  required rules={{required:true}}>
        <input type="text" name="name" placeholder={user?.name}  id="" disabled/>
        <br />
        </Form.Item>
        
        <Form.Item label={<span className='form-label'>Email</span>} name="email"  required rules={{required:true}}>
        <input type="email" name="email" placeholder={user?.email}  id="" disabled/>
        <br />
        </Form.Item>
        
        <Form.Item label={<span className='form-label'>Phone</span>} name="phone"  >
        <input type="number" name="phone" placeholder={user?.phone}  id=""  disabled/>
        <br />
        </Form.Item>

        

    </About>
    </Form>
    </fieldset>
  </Cred>
  </Layout>
  </Container>
  )
}



const Container=styled.div`
    grid-area:main;
`;
const Layout=styled.div`
   
 background-color: #ffff;
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    height:100%;
    border-radius: 5px;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
            flex-direction: column;
    -webkit-box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
            box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);

`;

const ButtonsContainer = styled.div`
 
 display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
          flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
          align-items: center;
`;

const Button = styled.button`
  background-color: #007bff;
  
  color: #fff;

  padding: 10px 20px;
 
  border: none;
  
  border-radius: 5px;
 
  cursor: pointer;
 
  &:hover {
    background-color: #0056b3;

  }

  &:focus {
    outline: none;
    
  }
`;

const CrossButton = styled.button`
  background-color: transparent;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const UserInfo=styled.div`
    border-bottom:1px solid rgba(0,0,0,0.15);
    padding:12px 12px 16px;
    word-wrap: break-word;
    word-break:break-word;
    width:100%;

`;

const CardBackground=styled.div`
    background:url("/images/card-bg.svg");
    background-position: center;
    background-size:462px;
    height:54px;
    max-width:100%;
    margin:-12px -12px 0;
`;

const Photo=styled.div`

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
img{
    -webkit-box-shadow:none;
            box-shadow:none;
    /* background-image: url("/images/photo.svg"); */
    width:72px;
    height:72px;
    -webkit-box-sizing:border-box;
            box-sizing:border-box;
    background-clip: content-box;
    background-color: white;
    background-position: center;
    background-size: 60%;
    background-repeat: no-repeat;
    border:2px solid white;
    margin:-38px auto 12px;
    border-radius:50%;
}
`;

const Link=styled.div`

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

    font-size:16px;
    line-height: 1.5;
    color:rgba(0,0,0,0,9);
    font-weight:600;
`;

const AddPhotoText=styled.div`

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

    color:#0a66c2;
    margin-top:4px;
    font-size:12px;
    line-height:1.33;
    font-weight:400;
`;

const Cred=styled.div`
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -webkit-box-align: start;
    -ms-flex-align: start;
            align-items: flex-start;
    -webkit-box-orient:vertical;
    -webkit-box-direction:normal;
    -ms-flex-direction:column;
            flex-direction:column;
    padding-left:20px;
    padding-top: 20px;
    padding-bottom:20px;
    -webkit-box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
            box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
    
    fieldset{
        border:0;
        border-radius:5px;
        -webkit-box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
                box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
        width:90%;

    }
    legend{
        font-weight:600;
    }

`;

const About=styled.form`
    
   
 textarea,input{
        height:40px;
        margin:10px;
        width:80%;
        border-top:0;
        border-left: 0;
        border-right: 0;
    }
    input::-webkit-input-placeholder{
        color:black;
        font-size: 1rem;
    }
    input::-moz-placeholder{
        color:black;
        font-size: 1rem;
    }
    input:-ms-input-placeholder{
        color:black;
        font-size: 1rem;
    }
    input::-ms-input-placeholder{
        color:black;
        font-size: 1rem;
    }
    input::placeholder{
        color:black;
        font-size: 1rem;
    }

`;

export default ProfileAdmin
