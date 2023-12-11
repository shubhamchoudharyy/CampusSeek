import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { host } from '../assets/APIRoute';

const Collegelist = () => {
  const [users, setUsers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [isFollowing, setIsFollowing] = useState({});
  const params = useParams();
  const {user}=useSelector((state)=>state.user)
  const navigate=useNavigate()
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

 

  const getColleges = async () => {
    try {
      const res = await axios.get(`${host}/user/getAllColleges`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setColleges(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get(`${host}/user/getUsers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIsFollowing = () => {
    const following = {};
    colleges.forEach((college) => {
      following[college.userId] = isUserFollowing(college.userId);
    });
    setIsFollowing(following);
  };

  const isUserFollowing = (collegeId) => {
    const currentUser = users.find((user) => user._id === params.id);
    return currentUser?.follow.some((followedCollege) => followedCollege.collegeId === collegeId);
  };

  const handleFollowClick = async (college) => {
    try {
      const collegeInfo = {
        collegeId: college.userId,
        collegeName: college.name,
        collegeLocation: college.location,
        collegeEmail: college.email,
        photoUrl: college.photoUrl,
      };

      const res = await axios.post(
        `${host}/user/followCollege/${params.id}`,
        collegeInfo,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        // Manually update the user's follow array
        setUsers((prevUsers) => {
          return prevUsers.map((user) => {
            if (user._id === params.id) {
              if (isFollowing[college.userId]) {
                user.follow = user.follow.filter(
                  (followedCollege) => followedCollege.collegeId !== college.userId
                );
              } else {
                user.follow.push(collegeInfo);
              }
            }
            return user;
          });
        });
        // Update the isFollowing state
        setIsFollowing((prevIsFollowing) => ({
          ...prevIsFollowing,
          [college.userId]: !prevIsFollowing[college.userId],
        }));
      }
    } catch (error) {
      message.error('Something Went Wrong');
    }
  };

  useEffect(() => {
    getUsers();
    getColleges();
  }, []);

  useEffect(() => {
    // Check and update isFollowing whenever users or colleges change
    checkIsFollowing();
  }, [users, colleges]);


  const filteredColleges = colleges.filter((college) => !isFollowing[college.userId]);
  return (
    <Container>
      <Layout>
        <Content>
        { filteredColleges.length>0 ?  filteredColleges.map((college) => (
            // Check if college.userId is equal to user._id and skip the college if they match
            college.userId === user._id ? null : (
              <Card key={college._id}>
                <Photo>
                  <img
                    src={college.photoUrl}
                    alt=""
                    onClick={() => navigate(`/user-search/${college.userId}`)}
                  />
                </Photo>
                <span onClick={() => navigate(`/user-search/${college.userId}`)}>
                  {college.name}
                </span>
                <AddPhotoText>
                  <span>
                    {college.district}, {college.state}, {college.country}
                  </span>
                </AddPhotoText>
                <Button>
                  {isFollowing[college.userId] ? (
                    <button
                      className="unfollow"
                      onClick={() => handleFollowClick(college)}
                    >
                      <span>Unfollow</span>
                    </button>
                  ) : (
                    <button
                      className="follow"
                      onClick={() => handleFollowClick(college)}
                    >
                      <span>Follow</span>
                    </button>
                  )}
                </Button>
              </Card>
            )
          )) :  <p>There are no colleges to show</p>}
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

const Button = styled.div`
  /* Use absolute positioning to always keep the button at the bottom */
 
  margin-top:8px;
    margin-bottom: 8px;

  .follow {
    width: 100%;
    border-radius: 30px;
    border: 0;
    cursor: pointer;
    background-color: #0a66c2;
    height: 20px;
    span {
      font-weight: 600;
      color: white;
    }
  }

  .unfollow {
    width: 100%;
    border-radius: 30px;
    border: 0;
    cursor: pointer;
    background-color: #fff;
    height: 20px;
    border: 1px solid;
    span {
      font-weight: 600;
    }
  }

  .follow:hover {
    background-color: #0a55c3;
  }

  .unfollow:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;



export default Collegelist;
