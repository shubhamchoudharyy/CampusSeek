import { Form, Spin ,message} from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import ReactPlayer from 'react-player'

const CollegeSearch = (props) => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const params = useParams();
    const baseURL = "http://localhost:5000/api/v1";
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
    const [rate, setRate] = useState(0); // State to track the rate value
    const [stars, setStars] = useState([false, false, false, false, false]); 
    const [rating, setRating] = useState(0);
    const userId=user._id;

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
          const res=await axios.post(`${baseURL}/college/getposts/${params.id}`,
          {userId:params.id},{
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
            `${baseURL}/user/followCollege/${params.id}`,
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

    useEffect(()=>{
        const getInfo=async()=>{
            try{
                const res=await axios.post(`${baseURL}/college/info/${params.id}`,
                    // {
                    //     headers: {
                    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
                    //     },
                    //   }
                )
                if(res.data.success){
                    setValues(res.data.data);
                }
            }catch(error){
                console.error(error)
            }
        };
        getInfo();

    },[params.id]);
    console.log(values)

    useEffect(()=>{
        getPost();
      },[userId]);
    
      useEffect(() => {
        // Check and update isFollowing whenever users or colleges change
        checkIsFollowing();
      }, [user, values]);

    if(!values){
        return <Spin style={{marginTop:'12px'}}/>
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
      const isRated = user.rating.some((item) => item.collegeId === params.id);
  
      if (isRated) {
        // Display a message because the user has already rated this college
        message.error('You have already rated this college.');
      } else {
        // Send the rating to the backend API
        const response = await axios.post(`${baseURL}/college/rate/${params.id}`, { rating:rating,userId:user._id,review:review });
  
        if (response.data.success) {
          // Handle success, e.g., show a success message
          message.success('Rating submitted successfully!');
          // setIsSubmitting(false);
        } else {
          // Handle errors, e.g., show an error message
          message.error('Rating submission failed.');
          // setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      // Handle network or other errors
      message.error('An error occurred while submitting the rating.');
      // setIsSubmitting(false);
    } 
  };

  const handleDeletePost=async(postId,post)=>{
    console.log('Delete is called')
    console.log('college',postId);
    console.log('user',user._id);
    console.log('post',post);

    
    
    try{
      
        console.log('in try')
        const res=await axios.post(`${baseURL}/college/deletepost`,{
          postId:post
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

  user.rating.forEach((item) => {
    if (item.collegeId === params.id) {
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
                <Photo>
                  {values.photoUrl ?
                    <img src={values.photoUrl} /> :
                    <img src='/images/photo.svg' />}
                </Photo>
                <Link>{values.name}</Link>
              </a>
              <a>
                <AddPhotoText>{values.district.toUpperCase()},{values.state.toUpperCase()},{values.country.toUpperCase()}</AddPhotoText>
              </a>
            </UserInfo>
            <Description>
              <span>{values.description}</span>
            </Description>
    
            <Button>
            {!user?.isAdmin && (
            isFollowing[values?.userId] ?  
              <button className='unfollow' onClick={() => handleFollowClick(values)}>
                <span>Unfollow</span>
              </button> :
              <button className='follow' onClick={() => handleFollowClick(values)}>
                <span>Follow</span>
              </button>
          )}

              {values.website &&
                <a href={values.website} target="_blank"  rel='noopener'>
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
            <Content>
            {post &&
                  post.map((article) => (
                    <Article key={article._id}>
                      <SharedActors>
                        <a onClick={()=>navigate(`/user-search/${article.userId}`)}>
                          <img src={article.photoUrl} alt="Actor" />
                          <div>
                            <span>{article.name}</span>
                            <span>{article.email}</span>
                            <span>{article.date}</span>
                          </div>
                        </a>
                        {user._id===article.userId ?
                    <User>
                    <button>...</button>
                    
                    <Delete >
                      <a onClick={()=>handleDeletePost(article.userId,article._id)}>Delete</a>
                    </Delete>
                    </User> : 
                    user?.isAdmin? 
                    <User>
                    <button>...</button>
                    
                    <Delete >
                      <a onClick={()=>handleDeletePost(article.userId,article._id)}>Delete</a>
                    </Delete>
                    </User>:
                    <button>....</button>} 
                      </SharedActors>
                      <Descriptions>{article.description}</Descriptions>
                      <SharedImg>
                        <a>
                          {!article.image && article.video ? (
                            <ReactPlayer width={'100%'} url={article.video} controls/>
                          ) : (
                            article.image && <img src={article.image} alt="Shared" />
                          )}
                          {/* <img src='/images/shivji.jpg' alt="shared"/> */}
                        </a>
                      </SharedImg>
                     
                    </Article>
                  ))} 
              </Content>
    }
    
        {showAbout &&
            <Content>
                <About>
                    <SharedActors>
                        <Info>
                        <div>
                        <span className='grey'>Location</span>
                        <span>{values.location}</span>
                        <span>{values.district},{values.state},{values.country}</span>
                        </div>
                        <div>
                        <span className='grey'>Email</span>
                        <span>
                        <a href={`mailto:${values.email}`}>{values.email}</a>
                        </span>
                        </div>
    
                        <div>
                        <span className='grey'>Contact</span>
                        <span>{values.phone}</span>
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
                  {values.courses &&
                    values.courses.map((course, index) => (
                        
                        <div className='already' key={index}>
                        {/* <span>{index}</span> */}
                       <span>{course.course}</span>
                       <span>{course.short}</span>
                       
                       <a href={course.file} target="_blank ">
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
             overall Rating: <span>{parseFloat(values.rating.$numberDecimal).toFixed(1)}</span>
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
            
            
            {user.rating.some((item) => item.collegeId === params.id) ? (
              <>
              <div>You have already rated {rated} stars to this college.</div>
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
          {values.ratings &&
          values.ratings
            .slice() // Create a shallow copy of the array to avoid mutating the original
            .reverse() // Reverse the order of the copied array
            .map((item, index) => (
              <Reviews key={index}>
                <div className="outer">
                  <div className="inner">
                    <div>Anonymous</div>
                    <div> {item.rate}★</div>
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
    )
}
const Container=styled.div`
    padding-top:52px;
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
    box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
`;
const Course=styled(CommonCard)``;

const Content=styled.div`
    max-width: 1128px;
    margin-left:auto;
    margin-right: auto;
    height: fit-content;
    box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
    
`;

const Article=styled(CommonCard)`
  padding:0;
  margin:0 0  8px;
  overflow:visible;
`;

const SharedActors=styled.div`
  padding:40px;
  flex-wrap:no-wrap;
  padding:12px 16px 0;   
  margin-bottom: 8px;
  align-items:center;
  display:flex;
  a{
    margin-right: 12px;
    flex-grow:1;
    overflow:hidden;
    display:flex;
    text-decoration: none;

    img{
      width:40px;
      height:40px;
    }
    &>div{
      display:flex;
      flex-direction: column;
      flex-grow:1;
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

const Descriptions=styled.div`
padding:0 16px;
overflow:hidden;
color:rgba(0,0,0,0.9);
font-size:16px;
text-align:left;
align-items: flex-start;

`;

const About=styled(CommonCard)`
    display: flex;
    flex-direction: column;
    /* background-color: red; */
    /* height:100px;
    width: 100%; */
    padding:0;
    margin:0 0  8px;
    overflow:visible;
`;

const Info=styled.div`
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    div{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        margin-bottom: 10px;

    }
    .grey{
        color: grey;
    }
`;
const SharedImg=styled.div`
  margin-top:8px;
  width:100%;
  display:block;
  position:relative;
  background-color: #f9fafb;
  img{
    object-fit:contain;
    width:100%;
    height:100%;
  }
`;
const Struct=styled.div`
    width: 600px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    margin-top:20px;
    /* background-color: red; */
    flex-direction: column;
    padding: 0 20px;
    span{
        height:40px;
        margin:10px;
        width:fit-content;
        border-top:0;
        border-left: 0;
        border-right: 0;
        text-transform: uppercase;
        /* color: white; */
        /* font-size:1px; */
    }
    div span{
        font-size:0.8rem;
        font-weight:600;
    }
    .already{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    button{
        border-radius:20px ;
        background-color: #0a6653;
        border: 0;
        margin-top: 0;
        cursor: pointer;
        span{
            color: white;
            font-size: .7rem;
        }
    }

`;
const Layout=styled.div`
    display: flex;
    
    border-radius: 5px;
    height:400px;
    flex-direction: column;
    
    margin:0 20% 0 25%;

    @media (max-width:600px){
    margin:0 8px 0 8px;
    border-radius: 5px;
    height:400px;
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
img{
    box-shadow:none;
    /* background-image: url("/images/photo.svg"); */
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

const Head=styled.div`
    background-color: beige;
    height: 30%;
    width:100%;
    display: flex;
    align-items: flex-start;
    img{
        height:40%;
        margin-left: 5%;
        margin-top: 10%;

    }
    

    @media (max-width:768px){
    height:20%;
    background-color: beige;
    width:100%;
    display: flex;
    align-items: flex-start;
    img{
        height:60%;
        margin-left: 5%;
        margin-top:8%;
    }
}

`;

const Cont=styled.div`
padding-top:10px ;
    display: flex;
    margin:20px;
    align-items: flex-start;
    span{

        color:rgba(0,0,0,0.9);
        font-weight: 1200;
        font-size: 1.3rem;
    }
    @media (max-width:768px){
    padding-top:10px ;
    display: flex;
    margin:20px;
    align-items: flex-start;
    span{

        color:rgba(0,0,0,0.9);
        font-weight: 1200;
        font-size: 1.3rem;
    }
}
`;
const Description=styled.div`
    color:black;
    margin:2%;
    /* background-color: red; */
    width: 100%;
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
    /* margin: 0 10px ; */
     @media (max-width:768px){
    padding-top: 10px;
    color: black;
     }
`;

const Button=styled.div`
    position: relative;
    display:flex;
    margin-top:10%;
    margin-left: 10px;
    
    button{
        width:120px;
        border-radius: 50px;
        background-color: #0A66C2;
        height: 40px;
        margin: 5px;
        border: 0;
        span{
            align-items: center;
            display: flex;
            justify-content: center;
            font-weight:600;
            color:rgba(0,0,0,0.7);
        }
    }
    .web{
        background-color: #fff;
        border: 1px solid;
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
    display:flex;
    flex-wrap:nowrap;
    list-style-type:none;
    justify-content: space-around;

    .active{
        span:after{
            content:"";
            transform: scaleX(1);
            border-bottom: 2px solid var(--white,#fff);
            bottom:0;
            left:0;
            position:absolute;
            transition:transform 0.2s ease-in-out;
            width:100%;
            border-color: rgba(0,0,0,0.9);

        }
    }
`;

const NavList=styled.li`
    display:flex;
    align-items:center;
    

    a{
        align-items:center;
        background:transparent;
        display:flex;
        flex-direction: column;
        font-size:12px;
        font-weight:400;
        justify-content:center;
        line-height:1.5;
        min-height:42px;
        min-width:88px;
        position:relative;
        text-decoration: none;

        span{
            color: rgba(0,0,0,0.5);
            display: flex;
            align-items:center;
            justify-content:space-around;
        }

        @media (max-width:768px){
            min-width:120px;
            
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
`;


const RatingContainer = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 600px;
  height: 300px;
`;

const RatingLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Stars = styled.div`
  display: flex;
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
`;


const Reviews=styled.div`
  height: fit-content;
  width: 100%;

  .outer{
    margin: 3px;
    padding: 5px;
  }
  

  .inner{
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
`;


const Delete=styled.div`
z-index: 9999;
position:absolute;
top:10px;
background: white;
border-radius: 0 0 5px 5px;
width:50px;
height:40px;
font-size: 16px;
transition-duration: 167ms;
text-align: center;
display: none;
@media(max-width:768px){
    top:-5px;
}
`;

const User=styled(NavList)`
a>svg{
    width:24px;
    border-radius:20%
}

a>img{
    width:24px;
    height:24px;
    border-radius:50%;
}

span{
    display: flex;;
    align-items:center;
}

&:hover{
    
    ${Delete}{
        align-items:center;
        display:flex;
        justify-content: center;
    }
}
`;

export default CollegeSearch
