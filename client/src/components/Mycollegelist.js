import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { message } from 'antd';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { host } from '../assets/APIRoute';

const Mycollegelist = () => {
  const [users, setUsers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [isFollowing, setIsFollowing] = useState({});
  const params = useParams();
  const navigate=useNavigate()

  

  const getFollowers = async () => {
    try {
      const res = await axios.get(`${host}/user/getfollow/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        
        setColleges(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
      // Display a user-friendly error message to the user
      message.error('Something went wrong while fetching followers.');
    }
  };
  console.log(colleges)
// 

const handleToggleFollow = async (collegeId) => {
    console.log(collegeId)
    console.log(params.id)
    try {
      const isFollowingCollege = colleges.some((college) => college.userId === collegeId);
  
      if (isFollowingCollege) {
        // If following, make a POST request to unfollow the college
        const res = await axios.post(
          `${host}/user/unfollowCollege/${params.id}`,
          { collegeId: collegeId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
  
        if (res.data.success) {
          message.success(res.data.message);
  
          // Update the colleges array to remove the unfollowed college
          setColleges(colleges.filter((college) => college.userId !== collegeId));
        }
      } else {
        // If not following, make a POST request to follow the college
        // You would need to construct the collegeInfo object here
        // and send it in the request body
        const collegeInfo = {
          // Populate the collegeInfo object with the necessary data
          collegeId: collegeId,
          
        };

        const res = await axios.post(
          `${host}/user/followerCollege/${params.id}`,
          collegeInfo,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (res.data.success) {
          message.success(res.data.message);
          // Update the colleges array to include the newly followed college
          setColleges([...colleges, collegeInfo]);
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      message.error('Something went wrong while toggling follow.');
    }
  };

  useEffect(() => {
    getFollowers();
  }, []);

  console.log(colleges)

  return (
    <Container>
      <Layout>
        <Content>
          {colleges.length>0 ?  colleges.map((college) => (
            <Card key={college._id}>
              <Photo onClick={()=>navigate(`/user-search/${college.userId}`)}>
              <img src={college.photoUrl} alt="user" />
              </Photo>
              <span onClick={()=>navigate(`/user-search/${college.userId}`)}>{college.name}</span>
              <AddPhotoText><span>{college.district},{college.state},{college.country}</span></AddPhotoText>
              <Button>
              <button onClick={() => handleToggleFollow(college.userId)}>
                  <span>
                    {colleges.some((c) => c._id === college._id)
                      ? 'Unfollow'
                      : 'Follow'}
                  </span>
                </button>
              </Button>
            </Card>
          )) : <p>There are no colleges to show</p>}
        </Content>
      </Layout>
    </Container>
  );
};





const Container = styled.div`
  grid-area: main;
`;

const Layout = styled.div`
 
 background-color: #ffff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  border-radius: 5px;
  -webkit-box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0, 0 0 0 rgba(0 0 0/15%);
          box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0, 0 0 0 rgba(0 0 0/15%);
`;

const Content = styled.div`
  
display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
      flex-wrap: wrap;
  margin-top: 10px;
  margin-left: 20px;
`;


const Card = styled.div`
  
display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
          flex-direction: column;
  -ms-flex-wrap: nowrap;
      flex-wrap: nowrap;
  justify-content: space-around;
  width: 130px;
  padding: 20px;
  border-radius: 5px;
  margin: 5px;
  margin-left: 15px;
  -webkit-box-shadow: 2px 3px #888888;
          box-shadow: 2px 3px #888888;
  background-color: #fff8;
  border: 0.5px solid rgba(0, 0, 0, 0.9);
  position: relative; /* Add this line to create a relative positioning context */
  max-width: 180px; /* Adjust the max-width as needed */
  height: 150px;

  img {
    height: 40px;
    margin-top: 10px;
    border-radius: 50%;
  }

  span {
    margin: 5px;
    font-size: 0.75rem;
  }
  @media screen {
   width :80px ;
   
   span {
    margin: 2px;
    font-size: 0.6rem;
  }
  }
`;


const Photo = styled.div`
  
img {
    -webkit-box-shadow: none;
            box-shadow: none;
    /* background-image: url("/images/photo.svg"); */
    width: 50px;
    height: 50px;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    background-clip: content-box;
    background-color: white;
    background-position: center;
    background-size: 60%;
    background-repeat: no-repeat;
    border: 2px solid white;
    margin: auto;
    border-radius: 50%;
  }
`;

const AddPhotoText = styled.div`
  
color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
  max-width: 90%;
  word-wrap: break-word;

  /* Add this CSS to truncate text and show ellipsis */
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
     text-overflow: ellipsis;
`;




const Button=styled.div`
   
 margin-top:8px;
    margin-bottom: 8px;
    
    button{
        width:100%;
        border-radius: 30px;
        border:0;
        cursor:pointer;
        background-color: #fff;
        height: 20px;
        border:1px solid;
        span{
            
            font-weight:600;
        }
    }

    button:hover{
        background-color: rgba(0,0,0,0.8);
    }
`;
export default Mycollegelist
