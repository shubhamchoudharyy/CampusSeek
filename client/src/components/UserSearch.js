import { Form, Spin ,message} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { useCopyToClipboard } from 'usehooks-ts';
import { host } from '../assets/APIRoute';
import Articles from './Articles';


const UserSearch = (props) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {id} = useParams();
  const params=useParams();

  const [values, setValues] = useState(null);
  const [activeComponent, setActiveComponent] = useState("Posts"); // Initialize with "Posts"
  const [post,setPost]=useState(null);
  const navigate=useNavigate();
  const [review, setReview] = useState('');
  const [showPosts, setShowPosts] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showRatings,setShowRatings]=useState(false);
  const [isFollowing, setIsFollowing] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copy,setCopy]=useCopyToClipboard();
  const [rate, setRate] = useState(0); // State to track the rate value
  const [stars, setStars] = useState([false, false, false, false, false]); 
  const userId=user?._id;



  const [rating, setRating] = useState(0);
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

  useEffect(()=>{
    const addView=async(req,res)=>{
      try{
        const res=await axios.post(`${host}/college/views/${params.id}`,{
          userId:user?._id,
        });

        if(res.data.success){
          // message.success("fetched");
        }

      }catch (error) {
      // message.error('Something Went Wrong');
    }
    }

    if(!user?.isAdmin && user?._id !== params.id){
      addView();
    }
  },[params.id]);

  const handleStarClick = (starValue) => {
    // If the clicked star is already checked, uncheck it
    if (starValue === rating) {
      setRating(0);
    } else {
      // Otherwise, set the rating to the clicked star value
      setRating(starValue);
    }
  };

  const getPost=async()=>{
    try{
      const res=await axios.post(`${host}/college/getposts/${id}`,
      {userId:id},{
        headers:{
          Authorization:` Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        setPost(res.data.data);
      }
    }catch(error){
      message.error('Something Went Wrong')
    }
  }

  
  const handleFollowClick = async (college) => {
    try {
      const collegeInfo = {
        collegeId: college.userid,
        collegeName: college.name,
        collegeLocation: college.location,
        collegeEmail: college.email,
        photoUrl: college.photoUrl,
      };

      const res = await axios.post(
        `${host}/user/followCollege/${id}`,
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

  const checkIsFollowing = () => {
    const following = {};
 
      following[values?.userId] = isUserFollowing(values?.userId);
    
    setIsFollowing(following);
  };

  const isUserFollowing = (collegeId) => {
    const currentUser=user;
    return currentUser?.follow.some((followedCollege) => followedCollege.collegeId === collegeId);
  };
  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await axios.post(`${host}/user/getInfo/${id}`);
        if (res.data.success) {
          setValues(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getInfo();
  }, [id]);
  // console.log(values);

  useEffect(() => {
    getPost();
    // Fetch posts periodically every 30 seconds
    const intervalId = setInterval(getPost, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [user?._id]);

  useEffect(() => {
    // Check and update isFollowing whenever users or colleges change
    checkIsFollowing();
  }, [user, values]);

  if (!values) {
    return <Spin style={{ marginTop: '12px' }} />;
  }

  // Function to handle clicking on "Posts"
  const handlePostsClick = () => {
    setActiveComponent("Posts");
    setShowPosts(true);
    setShowAbout(false);
    setShowCourses(false);
    setShowRatings(false);

  };

  // Function to handle clicking on "About"
  const handleAboutClick = () => {
    setActiveComponent("About");
    setShowPosts(false);
    setShowAbout(true);
    setShowCourses(false);
    setShowRatings(false);
  };

  // Function to handle clicking on "Courses"
  const handleCoursesClick = () => {
    setActiveComponent("Courses");
    setShowPosts(false);
    setShowAbout(false);
    setShowCourses(true);
    setShowRatings(false);
  };

  const handleRatingsClick = () => {
    setActiveComponent("Ratings");
    setShowPosts(false);
    setShowAbout(false);
    setShowCourses(false);
    setShowRatings(true);
  };
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };
  const handleSubmitRating = async () => {
    setIsSubmitting(true);
  
    try {
      // Check if params.id is already in user.rating.collegeId
      const isRated = user?.rating.some((item) => item.collegeId === id);
  
      if (isRated) {
        // Display a message because the user has already rated this college
        message.error('You have already rated this college.');
      } else {
        // Send the rating to the backend API
        const response = await axios.post(`${host}/college/rate/${id}`, {
          rating: rating,
          review: review,
          userId: user?._id,
        });
  
        if (response.data.success) {
          // Handle success, e.g., show a success message
          message.success('Rating submitted successfully!');
          
          // Set isSubmitting to false here
          // setIsSubmitting(false);
        } else {
          // Handle errors, e.g., show an error message
          message.error('Rating submission failed.');
          
          // Set isSubmitting to false here as well if there's an error
          // setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      // Handle network or other errors
      message.error('An error occurred while submitting the rating.');
      
      // Make sure to set isSubmitting to false in the error case
      // setIsSubmitting(false);
    }
  };
 
  const handleDeletePost=async(postId,post)=>{
    
    try{
      
        console.log('in try')
        const res=await axios.post(`${host}/college/deletepost`,{
          postId:post,collegeId:postId
        });
        if(res.data.success){
          message.success('Post Deleted Successfully');
        }else{
          message.error('Error While Deleting Post');
        }
      

    }catch(e){
      message.error('Error While deleting the post',);
      console.log(e)
    }
  
  }

  let rated = 0; // Initialize the rated variable
  let reviewed="";

  user?.rating.forEach((item) => {
    if (item.collegeId === id) {
      rated = item.rate; // Set the rated variable when a match is found
      reviewed=item.review;
    }
  });
 
  
  return (
    <Container>
      <Layout>
        <UserInfo>
          <CardBackground />
          <a>
            <Photo style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
              {values?.photoUrl ?
                <img src={values?.photoUrl} /> :
                <img src='/images/photo.svg' />}
            </Photo>
            <Link style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>{values?.name}</Link>
          </a>
          <a>
            <AddPhotoText style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>{values?.district.toUpperCase()},{values?.state.toUpperCase()},{values?.country.toUpperCase()}</AddPhotoText>
          </a>
        </UserInfo>
        <Description>
          <span>{values?.description}</span>
        </Description>

        <Button>
          {!user?.isAdmin && 
          (isFollowing[values?.userId] ?  
            <button className='unfollow' onClick={() => handleFollowClick(values)}>
              <span>Unfollow</span>
            </button>:
             <button className='follow' onClick={() => handleFollowClick(values)}>
             <span>Follow</span>
           </button>
           ) }
        
          {values?.website &&
            <a href={values?.website} target="_blank"  rel='noopener'>
              <button className='web'><span>Visit Website</span></button>
            </a>}

        </Button>
        <Nav>
          <NavListWrap>
            <NavList className={activeComponent === "Posts" ? "active" : ""}>
              <a onClick={handlePostsClick}>
                <span>Posts</span>
              </a>
            </NavList>
            <NavList className={activeComponent === "About" ? "active" : ""}>
              <a onClick={handleAboutClick}>
                <span>About</span>
              </a>
            </NavList>
            <NavList className={activeComponent === "Courses" ? "active" : ""}>
              <a onClick={handleCoursesClick}>
                <span>Courses</span>
              </a>
            </NavList>
            <NavList className={activeComponent === "Ratings" ? "active" : ""}>
              <a onClick={handleRatingsClick}>
                <span>Ratings</span>
              </a>
            </NavList>
          </NavListWrap>
        </Nav>
        {showPosts &&
        <Content2>
        {post &&
              post.map((article) => (
                
                <Articles article={article} key={article._id} />
              ))} 
          </Content2>
}

    {showAbout &&
        <Content>
            <About>
                <SharedActors>
                    <Info>
                    <div>
                    <span className='grey'>Location</span>
                    <span>{values?.location}</span>
                    <span>{values?.district},{values?.state},{values?.country}</span>
                    </div>
                    <div>
                    <span className='grey'>Email</span>
                    <span>
                    <a href={`mailto:${values?.email}`}>{values?.email}</a>
                    </span>
                    </div>

                    <div>
                    <span className='grey'>Contact</span>
                    <span>{values?.phone}</span>
                    </div>
                    </Info>
            </SharedActors>
            </About>

        </Content>
    }
    {showCourses && 
        <Content>
            <Course>
            <Struct>
              {values?.courses &&
                values?.courses.map((course, index) => (
                    
                    <div className='already' key={index}>
                    {/* <span>{index}</span> */}
                    <div>
                   <span>{course?.course}</span>
                   </div>
                   <div>
                   <span>{course?.short}</span>
                   </div>
                   
                   <a href={course?.file} target="_blank">
                        <button>
                        <span>View</span>
                        </button>
                    </a>
                    {/* <button onClick={() => handleRemoveCourse(index)}>
                        <span>Remove</span>
                    </button> */}
                    </div>
                ))
                }
                </Struct>
                </Course>
        </Content>
    }

{showRatings && (
        <Content>
          <RatingContainer>
            <RatingLabel>
             overall Rating: <span>{parseFloat(values?.rating.$numberDecimal).toFixed(1)}</span>
            </RatingLabel>
            <Stars>
              {[1, 2, 3, 4, 5].map((starValue) => (
                <Star
                  key={starValue}
                  onClick={() => handleStarClick(starValue)}
                  checked={starValue <= rating}
                >
                  ★
                </Star>
              ))}
            </Stars>
            {rating > 0 && !isSubmitting && (<>
              <RatingValue> Rated {rating} stars.</RatingValue>
             
              </>
            )}
            
            
            {user?.rating.some((item) => item.collegeId === id) ? (
              <>
              <span>You have already rated {rated} stars to this college.</span>
              <div>
              <textarea
                rows="4"
                cols="50"
                value={reviewed}
                disabled
                
              />
            </div>
            </>
            ) : (
              !isSubmitting ? (
                <>
                <div>
              <textarea
                rows="4"
                cols="50"
                placeholder="Write your review here"
                value={review}
                onChange={handleReviewChange}
              />
            </div>
                <SubmitButton onClick={handleSubmitRating}>Submit Rating and Review</SubmitButton>

                </>
              ) : (
                <SubmitButton disabled>Submitted</SubmitButton>
              )
            )}
          </RatingContainer>
          {values?.ratings &&
          values?.ratings
            .slice() // Create a shallow copy of the array to avoid mutating the original
            .reverse() // Reverse the order of the copied array
            .map((item, index) => (
              <Reviews key={index} style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <div className="outer">
                  <div className="inner">
                    <span>{item?.name}</span>
                    <span> {item?.rate}★</span>
                  </div>
                  <div>
                    <textarea rows="4" cols="50" disabled value={item.review} />
                  </div>
                </div>
              </Reviews>
            ))
        }

          
        </Content>
      )}


      </Layout>
    </Container>
  );
};
const Container=styled.div`
    padding-top:60px;
    margin:5px;
    max-width:100%;
    height:100%;

`;
const CommonCard=styled.div`
   
 text-align:center;
    overflow:hidden;
    margin-bottom:8px; 
    background-color:#fff;
    border-radius:5px;
    position:relative;
    border:none;
    -webkit-box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
            box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
`;
const Content=styled.div`
 
 max-width: 1128px;
    margin-left:auto;
    margin-right: auto;
    height: -webkit-fit-content;
    height: -moz-fit-content;
    height: fit-content;
    /* background-color: beige; */
    width:100%;
    -webkit-box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
            box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);

    @media (max-width:768px) {
      padding-bottom: 70px;

    }
    
`;
const Content2=styled.div`
   

 max-width: 1128px;
    margin-left:auto;
    margin-right: auto;
    height: -webkit-fit-content;
    height: -moz-fit-content;
    height: fit-content;
    
    width:100%;
    -webkit-box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
            box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
    
`;
const Course=styled(CommonCard)`
  width:100%;
`;


const SharedActors=styled.div`

padding:40px;
  width: 100%;
  -ms-flex-wrap:no-wrap;
      flex-wrap:no-wrap;
  padding:12px 16px 0;   
  margin-bottom: 8px;
  -webkit-box-align:center;
  -ms-flex-align:center;
          align-items:center;
  display:-webkit-box;
  display:-ms-flexbox;
  display:flex;
  cursor: pointer;
  a{
    margin-right: 12px;
    -webkit-box-flex:1;
        -ms-flex-positive:1;
            flex-grow:1;
    overflow:hidden;
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    text-decoration: none;

    img{
      width:40px;
      height:40px;
    }
    &>div{
      display:-webkit-box;
      display:-ms-flexbox;
      display:flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
          -ms-flex-direction: column;
              flex-direction: column;
      -webkit-box-flex:1;
          -ms-flex-positive:1;
              flex-grow:1;
      -ms-flex-preferred-size:0;
          flex-basis:0;
      margin-left:8px;
      overflow:hidden;
      span{
        text-align:left;
        &:first-child{
          font-size:14px;
          font-weight:700;
          color:rgba(0,0,0,1);
        }

        &:nth-child(n+1){
          font-size: 12px;
          color:rgba(0,0,0,0.6);
        }
      }
    }
    
  }
  button{
    position:absolute;
    right:12px;
    top:0;
    background:transparent;
    border:none;
    outline: none;

  }

`;


const About=styled(CommonCard)`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
            flex-direction: column;
    /* background-color: red; */
   
    padding:0;
    margin:0 0  8px;
    overflow:visible;
`;

const Info=styled.div`
    
width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
            flex-direction: column;
    -webkit-box-align: start;
    -ms-flex-align: start;
            align-items: flex-start;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
            justify-content: flex-start;

    div{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-align: start;
            -ms-flex-align: start;
                align-items: flex-start;
        -webkit-box-pack: start;
            -ms-flex-pack: start;
                justify-content: flex-start;
        margin-bottom: 10px;

    }
    .grey{
        color: grey;
    }
    @media (max-width:768px) {
     width :100% ;
    }
`;

const Struct=styled.div`
   
 width: 90%;

   display: flex;
   justify-content: space-around;
   align-items: center;
    margin-top:20px;
    /* background-color: red; */
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
            flex-direction: column;
    padding: 0 20px;
    span{
        height:40px;
        margin:10px;
        width:-webkit-fit-content;
        width:-moz-fit-content;
        width:fit-content;
        border-top:0;
        border-left: 0;
        border-right: 0;
        font-size: 0.7rem;
        text-transform: uppercase;
        /* color: white; */
        /* font-size:1px; */
    }
    div span{
        font-size:0.7rem;
        font-weight:500;
    }
    .already{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
          -ms-flex-pack: justify;
              justify-content: space-between;
      -webkit-box-align: center;
          -ms-flex-align: center;
              align-items: center;
      width: 100%;
      div{
     
        width: 200px;
        margin-top:4px ;
        margin-bottom: 4px;
        padding-top: 4px;
        padding-bottom: 4px;
      }
    }
    button{
        border-radius:20px ;
        background-color: #0a66c2;
        border: 0;
        margin-top: 0;
        cursor: pointer;
        span{
            color: white;
            font-size: .7rem;
            cursor: pointer;
        }
    }
    a{
      button:hover{
        background-color: #0a66c8;
      }
    }
    @media (max-width:768px) {
      width: 90%;
    }

`;



const Layout=styled.div`
   display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    border-radius: 5px;
    height:400px;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
            flex-direction: column;
    margin:0 20% 0 25%;
    @media (max-width:600px){
    margin:0 8px 0 8px;
    border-radius: 5px;
    height:400px;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    }
`;



const UserInfo=styled.div`
    border-bottom:1px solid rgba(0,0,0,0.15);
    padding:12px 12px 16px;
    word-wrap: break-word;
    word-break:break-word;

`;

const CardBackground=styled.div`
    background:url("/images/card-bg.svg");
    background-position: center;
    background-size:462px;
    height:54px;
    margin:-12px -12px 0;
`;

const Photo=styled.div`

display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-pack: center;
-ms-flex-pack: center;
        justify-content: center;
-webkit-box-align: center;
-ms-flex-align: center;
        align-items: center;
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

const Description=styled.div`
 
 color:black;
    margin:2%;
    /* background-color: red; */
    width: 100%;
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
     white-space: pre-wrap;
     font-size: 0.8rem;
    
    /* margin: 0 10px ; */
     @media (max-width:768px){
    padding-top: 10px;
    color: black;
     }
`;

const Button=styled.div`
  
  position: relative;
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    margin-top:10%;
    margin-left: 10px;
    cursor: pointer;
    
    .follow{
        width:120px;
        border-radius: 50px;
        background-color: #0A66C2;
        height: 40px;
        margin: 5px;
        border: 0;
        cursor: pointer;
        
        span{
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            font-weight:600;
            color:white;
        }
    }
    .follow:hover{
      background-color: #0A66C5;
    }
    .unfollow{
        width:120px;
        border-radius: 50px;
        background-color: rgba(0,0,0,0.08);
        height: 40px;
        margin: 5px;
        border: 1px solid;
        cursor: pointer;

        span{
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            font-weight:600;
            /* color:white; */
        }
    }
    .unfollow:hover{
      background-color: rgba(0,0,0,0.08);
    }
    .web{
        background-color: #fff;
        border: 1px solid;
    }
    button{
      
        width:120px;
        border-radius: 50px;
        background-color: rgba(0,0,0,0.08);
        height: 40px;
        margin: 5px;
        border: 1px solid;
        cursor: pointer;

        span{
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            font-weight:600;
            /* color:white; */
        
    }
    button:hover{
      background-color: rgba(0,0,0,0.08);
    }
    }

    @media (max-width:768px) {
      button, .follow, .unfollow{
      width: 80px;
      height: 30px;
      span{
        font-size: 0.7rem;
      }
      }
      
    }
`;

const Nav=styled.div`
    /* margin-left:auto; */
 
    display: block;
    width: 100%;
    
    @media (max-width:768px){
        position: relative;
        left:0;
        
        background: white;
        width:100%;
        z-index:1;
        
    }
`;

const NavListWrap=styled.ul`
   
 display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -ms-flex-wrap:nowrap;
        flex-wrap:nowrap;
    list-style-type:none;
    -ms-flex-pack: distribute;
        justify-content: space-around;

    .active{
        span:after{
            content:"";
            -webkit-transform: scaleX(1);
                -ms-transform: scaleX(1);
                    transform: scaleX(1);
            border-bottom: 2px solid var(--white,#fff);
            bottom:0;
            left:0;
            position:absolute;
            -webkit-transition:-webkit-transform 0.2s ease-in-out;
            transition:-webkit-transform 0.2s ease-in-out;
            -o-transition:transform 0.2s ease-in-out;
            transition:transform 0.2s ease-in-out;
            transition:transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;
            width:100%;
            border-color: rgba(0,0,0,0.9);

        }
    }
    @media (max-width:768px) {
        width: 90%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: distribute;
            justify-content: space-around;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -ms-flex-wrap: nowrap;
            flex-wrap: nowrap;
    }
`;

const NavList=styled.li`
    
display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -webkit-box-align:center;
    -ms-flex-align:center;
            align-items:center;
    cursor: pointer;
    

    a{
        -webkit-box-align:center;
            -ms-flex-align:center;
                align-items:center;
        background:transparent;
        display:-webkit-box;
        display:-ms-flexbox;
        display:flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        font-size:12px;
        font-weight:400;
        -webkit-box-pack:center;
            -ms-flex-pack:center;
                justify-content:center;
        line-height:1.5;
        min-height:42px;
        min-width:88px;
        position:relative;
        text-decoration: none;

        span{
            color: rgba(0,0,0,0.5);
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align:center;
                -ms-flex-align:center;
                    align-items:center;
            -ms-flex-pack:distribute;
                justify-content:space-around;
        }

       
        
        }
        &:hover,
        &:active{
            a{
                span{
                    color:rgba(0,0,0,0.9)
                }
            }

    } 
    @media (max-width:768px){
     a{
        min-width: 20px;
     }   
    }
`;

const RatingContainer = styled(CommonCard)`
  
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
  -ms-flex-pack: distribute;
      justify-content: space-around;
  width: 100%;
  height: 300px;
  span{
    font-size: 0.85rem;
  }
  
`;

const RatingLabel = styled.div`
 
 font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  @media (max-width:768px) {
  
    font-size:1rem;
    span{
      font-size: 1rem;
    }
  
  }
  
`;

const Stars = styled.div`
  
display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
          justify-content: center;
`;
const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #0A66C2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Star = styled.span`
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => (props.checked ? 'gold' : 'gray')};
`;

const RatingValue = styled.div`
  font-size: 16px;
  
  margin-top: 10px;
  @media (max-width:768px){
   font-size :0.7rem ;
  }
`;
const Reviews=styled.div`

height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  width: 100%;
 
  .outer{
    margin: 3px;
    padding: 5px;
    textarea{
      font-size: 0.8rem;
    }
  }
  

  .inner{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
        justify-content: space-around;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
  }

  @media (max-width:768px) {
    span{
      font-size: 0.7rem;
    }
  }
  
`;




export default UserSearch
