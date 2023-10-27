import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { host } from '../assets/APIRoute';

const Searches = (props) => {
  const [users, setUsers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [isFollowing, setIsFollowing] = useState({});
  const params = useParams();
  const { user } = useSelector((state) => state.user);
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

 

    useEffect(() => {
      console.log('Search prop:', props.search);
      // Rest of your component code
    }, [props.search]);
  
    // ...
  
  

 const handleReset=()=>{
  props.setSearch("");
 }

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

  const filterCollegesByName = () => {
    return colleges.filter((college) =>
      college.name.toLowerCase().includes(props.search?.toLowerCase()) ||
      college.country.toLowerCase().includes(props.search?.toLowerCase()) ||
      college.state.toLowerCase().includes(props.search?.toLowerCase()) ||
      college.district.toLowerCase().includes(props.search?.toLowerCase()) ||
      college.courses.some((course) =>
        course.course.toLowerCase().includes(props.search?.toLowerCase()) ||
        course.short.toLowerCase().includes(props.search?.toLowerCase())
      )
    );
  };
  

  const checkIsFollowing = () => {
    const following = {};
    filterCollegesByName().forEach((college) => {
      following[college.userId] = isUserFollowing(college.userId);
    });
    setIsFollowing(following);
  };

  const isUserFollowing = (collegeId) => {
    const currentUser = user;
    return currentUser?.follow.some(
      (followedCollege) => followedCollege.collegeId === collegeId
    );
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
    getColleges();
  }, []);

  useEffect(() => {
    // Check and update isFollowing whenever users or colleges change
    checkIsFollowing();
  }, [user, colleges, props.search]);
  

  return (
    props.search !== '' && (
      <Container>
        <Layout>
          <College>
          {filterCollegesByName().map((college) => (
            
            <Content key={college._id}>
              <Photo onClick={()=>{
                navigate(`/user-search/${college.userId}`)
                handleReset()
            }}>
                <img src={college.photoUrl} alt='User' />
              </Photo>
              <div className='already' onClick={()=>{
                navigate(`/user-search/${college.userId}`)
                handleReset()}
            }>
                <span>{college.name}</span>
                <span>
                  {college.district}, {college.state}, {college.country}
                </span>
              </div>
              <div>
                <span>{parseFloat(college.rating.$numberDecimal).toFixed(1)}/5 ★</span>
              </div>
              <Button>
              {isFollowing[college.userId] ?  
                <button className='unfollow' onClick={() => handleFollowClick(college)}>
                  <span>Unfollow</span>
                </button>:
                 <button className='follow' onClick={() => handleFollowClick(college)}>
                 <span>Follow</span>
               </button>
               }
              </Button>
            </Content>
          ))}
          </College>
        </Layout>
      </Container>
    )
  );
};





const Container = styled.div`
   
 position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:9999;
    color:black;
    margin-top: 5%;
    width: 100%;
    
    background-color: rgba(0,0,0,0.8);
    /* background-color: #fff; */
    -webkit-animation: fadeIn 0.3s;
            animation: fadeIn 0.3s;
    @media (max-width:768px) {
     margin-top :12% ;
    }
  
`;

const Layout = styled.div`
  
background-color: #ffff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  border-radius: 5px;
  margin: 20px;
  width: 50%;
  margin-left: auto;
    margin-right: auto;
  -webkit-box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0, 0 0 0 rgba(0 0 0/15%);
          box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0, 0 0 0 rgba(0 0 0/15%);
  @media (max-width:768px) {
   width :100% ;
  }
`;

const College=styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
          flex-direction: column;
  width: 80%;

`;
const Content = styled.div`

display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  /* flex-wrap: wrap; */
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-left: 20px;
  margin: 15px;
  -webkit-box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0, 0 0 0 rgba(0 0 0/15%);
          box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0, 0 0 0 rgba(0 0 0/15%);
  -webkit-box-align: center;
  -ms-flex-align: center;
          align-items: center;
  -ms-flex-pack: distribute;
      justify-content: space-around;
  
  .already{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    
  }
  span{
      font-size: 0.7rem;
    }
`;
const Photo=styled.div`
     img{
      width:40px;
      height:40px;
    }
`;


const Button = styled.div`
 
 margin-top: 8px;
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

  .unfollow{
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

  .follow:hover {
    background-color: #0a55c3;
  }

  .unfollow:hover{
        background-color: rgba(0,0,0,0.8);
    }
`;

export default Searches;
