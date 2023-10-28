import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Form, message, Input, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import FileBase from 'react-file-base64';
import { showLoading,hideLoading } from '../../redux/features/alertSlice';
import { host } from '../../assets/APIRoute';
import { loadStripe } from '@stripe/stripe-js';


const ProfileClg = (props) => {
  const { user } = useSelector((state) => state.user);
  const [initialValues, setInitialValues] = useState(null);
  const initialCourse = { course: '', short: '', file: '' };
  const [course, setCourse] = useState(initialCourse);
  const [latestCourse, setLatestCourse] = useState(null);

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [showUploadAndPostButton, setShowUploadAndPostButton] = useState(true);
  const [showCrossButton, setShowCrossButton] = useState(false);
  const [isCourseFormFilled, setIsCourseFormFilled] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);



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

  const addCourse = () => {
    // Check if both the course name and file are not empty before adding it
    if (course.course !== '' && course.short!=='' && course.file !== '') {
      // Set the latest course as the current course
      setLatestCourse(course);
      // Reset the current course to the initial state
      setCourse(initialCourse);
    }
  };

  const handleCourseNameChange = (value, fieldName) => {
    const updatedCourse = { ...course };
    updatedCourse[fieldName] = value;
    setCourse(updatedCourse);
  
    // Check if all fields are filled
    const isFilled = Object.values(updatedCourse).every((field) => field !== '');
    setIsCourseFormFilled(isFilled);
  };
  

  

  const removeFile = () => {
    const updatedCourse = { ...course };
    updatedCourse.file = '';
    setCourse(updatedCourse);
  };

  const removeCourse = () => {
    setCourse(initialCourse);
  };


  
  const saveLatestCourseToDatabase = async () => {
    try {
      const response = await axios.post(
        `${host}/college/addCourses/`,
        {
          userId: params.id,
          courses: course, // Send the latest course with the file URL to the server
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        message.success('Latest course saved successfully');
        const updatedCourses = [...initialValues.courses, course];
        setInitialValues({ ...initialValues, courses: updatedCourses });
        // Reset the course input fields
        setCourse(initialCourse);
      } else {
        message.error('Failed to save the latest course');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred while saving the latest course');
    }
  };
  // Add an event handler for the "Save" button
  const handleSaveButtonClick = () => {
    saveLatestCourseToDatabase();
  };

  const handleFileUpload = async (file) => {
    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${host}/college/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.data) {
        // Update the current course with the file URL
        const updatedCourse = { ...course };
        updatedCourse.file = response.data.data;
        setCourse(updatedCourse);
        message.success('File uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('File upload failed.');
    }finally{
      setUploadingFile(false)
    }
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

  const handleRemoveCourse=async(index)=>{
    try{
      const res=await axios.post(`${host}/college/remove`,
      {index:index,userId:params.id},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        message.success(res.data.message)
        const updatedInitialValues = { ...initialValues };
        updatedInitialValues.courses.splice(index, 1);
        setInitialValues(updatedInitialValues);

      }
    }catch(error){
      console.log(error);
    }

  }
  useEffect(() => {
    const getCollegeInfo = async () => {
      try {
        const res = await axios.post(
          `${host}/college/getCollegeInfo/`,
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
    getCollegeInfo();
  }, [params.id]);

  const handleFinish = async (values) => {
    // e.preventDefault();
    console.log(values)
    console.log(values.website)
    try {
      dispatch(showLoading());
  
     
      if (user) {
        const res = await axios.post(
          `${host}/college/update`,
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
          
        } else {
          message.error(res.data.message);
        }
      } else {
        
        message.error('User not found. Please log in again.');
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong');
    }
  };


  if (!initialValues) {
    return <div>Loading....</div>;
  }
  
  const makePayment=async()=>{
    const stripe=await loadStripe("pk_test_51O5phpSFLLswxD1rH5SoGpRWFzjkKvHIaEhfh2jsvj9qYqkFwQDqBxanMi0CxhVJx51AMK8HWfAOLleLVbdZPX9600vdPZFLZO")

    const body={
      products:user
    }
    const headers={
      "Content-type":"application/json"
    }

    const res=await axios.post(`${host}/college/create-checout-session`,user);
    console.log(res)
  const session=res.data.id;
  const url=res.data.url;
  window.location=url
  


  const result =stripe.redirectToCheckout({
    sessionId:session.id
  })

  if(result.error){
    console.log(result.error )
  }
  }

  const expired=new Date(user?.expired)

  
  return (
    <Container>
      <Layout>
        
          <UserInfo>
            <CardBackground />
            <a>
              <Photo>
                <img src={newPhotoUrl || user?.photoUrl} alt='user' />
                {imageSelected && showUploadAndPostButton && (
                  <ButtonsContainer>
                    <Buttons onClick={handleUploadAndPost}>Upload and Post</Buttons>
                    {showCrossButton && (
                      <CrossButton onClick={handleResetImage}>❌</CrossButton>
                    )}
                  </ButtonsContainer>
                )}
                {uploading && <Spin style={{ marginTop: '12px' }} />}
              </Photo>
              <Link >{user?.name}</Link>
            </a>
            <a>
              <AddPhotoText >
                <label htmlFor="photoUpload">Edit Photo</label>
                <input
                  type="file"
                  name="photoUrl"
                  id="photoUpload"
                  accept="image/*" 
                  style={{ display: 'none' }}
                  onChange={handleChange}
                />
              </AddPhotoText>
            </a>
          </UserInfo>
          <Cred>
          <Form layout='vertical' onFinish={handleFinish} style={{width:'100%'}} initialValues={{ ...initialValues }}>
            <fieldset>
              <legend>About</legend>
              <About>

                <Form.Item label='College/University Name' name='name' required rules={[{ required: true }]}>
                  <Input className="black-text-input" placeholder='College/University Name' disabled />
                </Form.Item>
                <Form.Item label='Address' name='location' required rules={[{ required: true }]}>
                  <Input className="uppercase-input" placeholder='Address' disabled />
                </Form.Item>
                <Form.Item label='District' name='district' required rules={[{ required: true }]}>
                  <Input className="uppercase-input" placeholder='District' disabled />
                </Form.Item>
                <Form.Item label='State' name='state' required rules={[{ required: true }]}>
                  <Input className="uppercase-input" placeholder='State' disabled />
                </Form.Item>
                <Form.Item label='Country' name='country' required rules={[{ required: true }]}>
                  <Input className="uppercase-input" placeholder='country' disabled />
                </Form.Item>
                <Form.Item label='E-mail' name='email' required rules={[{ required: true, type: 'email' }]}>
                  <Input className="black-text-input" placeholder='E-mail' disabled />
                </Form.Item>
                <Form.Item
                  label='Phone no'
                  name='phone'
                  required
                  rules={[
                    { required: true },
                    {
                      pattern: /^[0-9-]*$/,
                      message: 'Please enter a valid phone number',
                    },
                  ]}
                >
                  <Input className="black-text-input" disabled placeholder='Phone no' />
                </Form.Item>
                <Form.Item label='Website' name='website'>
                  <Input className="black-text-input" placeholder='Website' />
                </Form.Item>
                <Form.Item label='Description' name='description'>
                  <Input.TextArea className="black-text-input" placeholder='Description' />
                </Form.Item>
           
              </About>
             
            </fieldset>
            <Button >
            <button >
              <span>Update</span>
            </button>
          </Button>
        </Form>
          </Cred>
          <Course>
            <fieldset>
              <legend>Add Courses</legend>
              
              <Struct>
              {initialValues.courses &&
  initialValues.courses.map((course, index) => (
    
    <div className='already' key={index}>
      {/* <span>{index}</span> */}
      <input
        type='text'
        name='course'
        placeholder='Bachelor of technology'
        value={course.course}
        className='uppercase-input'
        disabled
        required
        onChange={(e) => handleCourseNameChange(e.target.value, 'courseName')}
      />
      <input
        type='text'
        name='short'
        placeholder='BTech'
        value={course.short}
        disabled
        className='uppercase-input'
        onChange={(e) => handleCourseNameChange(e.target.value, 'short')}
        required
      />
       <a href={course.file} target="_blank">
        <button>
          <span>View</span>
        </button>
      </a>
      <button onClick={() => handleRemoveCourse(index)}>
        <span>Remove</span>
      </button>
    </div>
  ))
}

{/* Add Course Section */}
<div className='already'>
  <input
    type='text'
    name='course'
    placeholder='Bachelor of technology'
    value={course.course}
    className='uppercase-input'
    required
    onChange={(e) => handleCourseNameChange(e.target.value, 'course')}
  />
  <input
    type='text'
    name='short'
    placeholder='BTech'
    value={course.short}
    className='uppercase-input'
    onChange={(e) => handleCourseNameChange(e.target.value, 'short')}
    required
  />
  <div>
  <span>Fee Structure</span>
    {uploadingFile ? ( // Check if uploadingFile is true
      <Spin /> // Render your loader component here
    ) : (
      course.file ? (
        <FileWrapper>
          <span>{course.file.name}</span>
          <CrossIcon onClick={removeFile}>❌</CrossIcon>
        </FileWrapper>
          ) : (
            <CustomFileInput className='custom-file-input'>
              <span>Upload</span>
              <input type='file' onChange={(e) => handleFileUpload(e.target.files[0])} />
            </CustomFileInput>
          )
        )}
      </div>
    </div>

            <div className='already'>
              <button
                onClick={handleSaveButtonClick}
                disabled={!course.course || !course.short || !course.file}
              >
                <span>Save</span>
              </button>
              <CancelButton onClick={removeCourse}>
                <span>Cancel</span>
              </CancelButton>
              <button onClick={addCourse}>
                <span>Add Another Course</span>
              </button>
            </div>


              </Struct>
            </fieldset>
          </Course>
          <div className='payment'>
          {user?.premium ? <span>Your Premium is valid till {expired?.getFullYear() }-{expired?.getMonth()+1 }-{expired?.getDate() }</span> :
          <>
          <span>Get a premium membership at Rs.1500</span>
          <Button>
          <button onClick={makePayment}><span>Pay</span></button>
          </Button>
          </>
        }
        </div>
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
    
    .payment{
      margin: 10px;
      padding: 10px;
      span{
        font-size: 0.8rem;
      }
    }

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
const Buttons = styled.button`
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
    .black-text-input {
    font-weight: 600;
    color: black; 
  }
  .uppercase-input {
  text-transform: uppercase;
  font-weight: 600;
    color: black;
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
        white-space: pre-line; 
    }

`;


const Course=styled(Cred)`
    padding:10px;
    button{
        width:-webkit-fit-content;
        width:-moz-fit-content;
        width:fit-content;
        border:0;
        height: 30px;
        background-color: #0a66c1;
        cursor:pointer;
        margin:10px;
        border-radius:10px;
        span{
            font-weight:600;
            color:white;
        }
    }
    button:hover{
        background-color: #0a55c3;
    }
    .cancel{
        background-color: transparent;
        border:1px solid rgba(0,0,0,0.8);
    }
    .cancel:hover{
        background-color:rgba(0,0,0,0.07);
    }
    .cancel span{
        color:black;
    }

`;

const Struct=styled.div`

   
 display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -webkit-box-align:center;
    -ms-flex-align:center;
            align-items:center;
    -ms-flex-pack: distribute;
        justify-content: space-around;
    margin-top:20px;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
            flex-direction: column;
    input{
        height:40px;
        margin:10px;
        width:80%;
        border-top:0;
        border-left: 0;
        border-right: 0;
    }
    div span{
        font-size:0.8rem;
        font-weight:600;
    }
    .already{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    }
`;

const CustomFileInput = styled.label`
 
 display: inline-block;
  background-color: #0a66c2;
  color: white;
  width:-webkit-fit-content ;
  width:-moz-fit-content ;
  width:fit-content ;
  padding:0 5px;
  height:28px;
  border-radius: 5px;
  cursor: pointer;
  span{
    font-weight:600;
    font-size:1rem;
  }
  &:hover{
    background-color: #0a55c1;
  }

  input[type='file'] {
    display: none;
    opacity: 0;
  }

 /* Hide the default file input */
.custom-file-input input[type="file"] {
  display: none;
}

/* Style the custom upload button */
.custom-file-input {
  display: inline-block;
  background-color: #0a66c2;
  color: white;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  padding: 0 5px;
  height: 28px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
}

.custom-file-input span {
  font-weight: 600;
  font-size: 1rem;
}

.custom-file-input:hover {
  background-color: #0a55c1;
}
`;

const FileWrapper = styled.div`
  
display: inline-block;
  background-color: #0a66c2;
  color: white;
  padding: 10px 10px;
  border-radius: 5px;
  cursor: pointer;
  span{
    font-size:0.2rem;
  }
`;

const CrossIcon = styled.span`
  margin-left: 5px;
  cursor: pointer;
`;


const Button=styled.div`

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

    margin: 20px;
    align-items: center;
    justify-content:center;
    button{
        cursor:pointer;
        width:90px;
        height:30px;
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
`;



const CancelButton = styled.button`
  
cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: 5px;
  color: rgba(0,0,0,0.8);
  width:-webkit-fit-content;
  width:-moz-fit-content;
  width:fit-content;
  height: 18px;
  margin: 10px;
  font-weight: 600;
  -webkit-transition: background-color 0.2s;
  -o-transition: background-color 0.2s;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;
export default ProfileClg
