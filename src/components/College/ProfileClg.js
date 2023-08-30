import React from 'react'
import styled from 'styled-components'

const ProfileClg = (props) => {
    const initialCourse = { courseName: '', file: null };
    const [courses, setCourses] = React.useState([initialCourse]);
  
    const addCourse = () => {
      const lastCourse = courses[courses.length - 1];
      if (lastCourse.courseName !== '' || lastCourse.file !== null) {
        setCourses([...courses, initialCourse]);
      }
    };
  
    const handleCourseNameChange = (index, value) => {
      const updatedCourses = [...courses];
      updatedCourses[index].courseName = value;
      setCourses(updatedCourses);
    };
  
    const handleFileChange = (index, file) => {
      const updatedCourses = [...courses];
      updatedCourses[index].file = file;
      setCourses(updatedCourses);
    };
  
    const removeFile = (index) => {
      const updatedCourses = [...courses];
      updatedCourses[index].file = null;
      setCourses(updatedCourses);
    };
  
    const removeCourse = (index) => {
      const updatedCourses = [...courses];
      updatedCourses.splice(index, 1);
      setCourses(updatedCourses);
    };

  return (
    <Container>
        <Layout>
        <UserInfo>
          <CardBackground/>
              <a>
                  <Photo/>
                  <Link>Guru Nanak Dev Engineering College</Link>
              </a>
              <a>
                  <AddPhotoText>Edit Photo</AddPhotoText>
              </a>
             
      </UserInfo>
      <Cred>
      <fieldset>
      <legend>About</legend>
        <About>
            
            <input type="text" name="college_name" placeholder='College/University Name'  id="" />
            <br />
            
            <input type="text" name="location" placeholder='Address'  id="" />
            <br />
            
            <input type="email" name="email" placeholder='E-mail'  id="" />
            <br />
            
            <input type="number" name="phone" placeholder='Phone no'  id="" />
            <br />

            <input type="text" name="website" placeholder='Website'  id="" />
            <br />

            <textarea name="description" placeholder='Description' id="" cols="30" rows="10"></textarea>
            <br/>

        </About>
        </fieldset>
      </Cred>

      <Course>
        <fieldset>
        <legend>Add Courses</legend>
          {courses.map((course, index) => (
            <Struct key={index}>
              <input
                type="text"
                name="course"
                placeholder="Course Name"
                value={course.courseName}
                onChange={(e) => handleCourseNameChange(index, e.target.value)}
              />
              <div>
                <span>Fee Structure</span>
                {course.file ? (
                  <FileWrapper>
                    <span>{course.file.name}</span>
                    <CrossIcon onClick={() => removeFile(index)}>❌</CrossIcon>
                  </FileWrapper>
                ) : (
                  <CustomFileInput>
                    <span>Upload</span>
                    <input
                      type="file"
                      name="file"
                      onChange={(e) => handleFileChange(index, e.target.files[0])}
                    />
                  </CustomFileInput>
                )}
              </div>
              {courses.length > 1 && ( // Check if there's more than one course
                <RemoveCourseButton onClick={() => removeCourse(index)}>
                  Remove Course
                </RemoveCourseButton>
              )}
            </Struct>
          ))}
           <button><span>Save</span></button>
          <CancelButton onClick={() => setCourses([initialCourse])}>
            <span>Cancel</span>
          </CancelButton>
   

           
            
            <button onClick={addCourse}><span>Add Another Course</span></button>
        </fieldset>
      </Course>

      <Button>
        <button><span>Update</span></button>
      </Button>
        </Layout>
    </Container>
  )
}

const Container=styled.div`
    grid-area:main;
`;
const Layout=styled.div`
    background-color: #ffff;
    display:flex;
    height:100%;
    border-radius: 5px;
    flex-direction: column;
    box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);

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
    box-shadow:none;
    background-image: url("/images/photo.svg");
    width:72px;
    height:72px;
    box-sizing:border-box;
    background-clip: content-box;
    background-color: white;
    background-position: center;
    background-size: 60%;
    background-repeat: no-repeat;
    border:2px solid white;
    margin:-38px auto 12px;
    border-radius:50%;
`;

const Link=styled.div`
    font-size:16px;
    line-height: 1.5;
    color:rgba(0,0,0,0,9);
    font-weight:600;

`;

const AddPhotoText=styled.div`
    color:#0a66c2;
    margin-top:4px;
    font-size:12px;
    line-height:1.33;
    font-weight:400;
`;

const Cred=styled.div`
    display:flex;
    align-items: flex-start;
    flex-direction:column;
    padding-left:20px;
    padding-top: 20px;
    padding-bottom:20px;
    box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
    
    fieldset{
        border:0;
        border-radius:5px;
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

`;


const Course=styled(Cred)`
    padding:10px;
    button{
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

    display:flex;
    align-items:center;
    justify-content: space-around;
    margin-top:20px;
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

`;

const CustomFileInput = styled.label`
  display: inline-block;
  background-color: #0a66c2;
  color: white;
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

  input[type="file"] {
    display: none;
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

const RemoveCourseButton = styled.button`
  cursor: pointer;
  background-color: #e74c3c;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 5px 10px;
  margin-top: 10px;
  font-size: 0.8rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

const CancelButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: 5px;
  color: rgba(0,0,0,0.8);
  width:fit-content;
  height: 18px;
  margin: 10px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;
export default ProfileClg
