import React,{useState} from 'react'
import styled from 'styled-components'
import PostModel from './PostModel'
import { connect, useDispatch, useSelector } from 'react-redux';
import {useEffect} from 'react';
// import { getArticleAPI } from '../actions';
import ReactPlayer from 'react-player';
import { combineReducers } from 'redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spin,message } from 'antd';
const Mainclg = () => {
  const [showModel, setShowModel] = useState('close');
  const [post,setPost]=useState(null);
  const baseURL = "http://localhost:5000/api/v1";
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {user}=useSelector((state)=>state.user)
  useEffect(() => {
    if (!localStorage.getItem('token') ) {
      // Redirect to the login page if there's no token or user data
      navigate('/login');
    }
  }, [user, navigate]);
 const getPost = async () => {
    try {
      const res = await axios.post(`${baseURL}/college/getpost`, { userId: user._id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success) {
        setPost(res.data.data);
      }
    } catch (error) {
      message.error('Something Went Wrong');
    }
  }
  const handleClick = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }
    setShowModel((prevState) => (prevState === 'open' ? 'close' : 'open'));
  };

  useEffect(() => {
    getPost();
    // Fetch posts periodically every 30 seconds
    const intervalId = setInterval(getPost, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [user._id]);

  const handleDeletePost=async(postId,post)=>{
    console.log('Delete is called')
    console.log('college',postId);
    console.log('user',user._id);
    console.log('post',post);

    
    if(postId===user._id){
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
  }
  if (!post) {
    return <Spin style={{ marginTop: '12px' }} />
  }
 

  return (
    <>
     
        <Container>
          <ShareBox>
            <div>
              {user && user.photoUrl ? (
                <img src={user.photoUrl} alt="User" />
              ) : (
                <img src="/images/user.svg" alt="User" />
              )}
              {/* <img src="/images/user.svg" alt="User" /> */}
              <button onClick={handleClick} >
                Start a post
              </button>
            </div>

            <div className='post-btn'>
              <button>
                <img src="/images/photo-icon.svg" alt="" />
                <span>Photo</span>
              </button>
              <button>
                <img src="/images/video-icon.svg" alt="" />
                <span>Video</span>
              </button>
              
              <button>
                <img src="/images/article-icon.svg" alt="" />
                <span>Web Article</span>
              </button>
            </div>
          </ShareBox>
          {post.length === 0 ? (
        <p>There are no articles</p>
      ) : (
          <Content>
            {/* {props.loading && <img src="./images/spin-loader.svg" alt="Loading" />} */}
            {post.length > 0 &&
              post.map((article) => (
                <Article key={article._id} >
                  <SharedActors >
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
          )} 
          <PostModel showModel={showModel} handleClick={handleClick} />
        </Container>
      
    </>
  );
};


const Container=styled.div`
    grid-area: main;
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
const ShareBox=styled(CommonCard)`
  display:flex;
  flex-direction:column;
  color:#958b7b;
  margin: 0 0 8px;
  background:white;

  div{
    
    button{
      outline:none;
      color:rgba(0,0,0,0.6);
      font-size:14px;
      line-height:1.5;
      min-height:48px;
      background:transparent;
      border:none;
      display:flex;
      align-items: center;
      font-weight:600;


    }
    &:first-child{
      display:flex;
      align-items:center;
      padding:8px 16px 8px 16px;
      img{
        width:48px;
        border-radius:50%;
        margin-right:8px;

      }
      button{
        margin:4px 0;
        flex-grow: 1;
        border-radius:35px;
        padding-left:16px;
        border:1px solid rgba(0,0,0,0.15);
        background-color:white;
        text-align:left;
      }
    }
    &:nth-child(2){
      display:flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;


      button{
        img{
          margin:0 4px 0 -2px;

        }
        span{
          color:#70b5f9;
        }
      }
    }
  }
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

const SocialCounts=styled.ul`
  line-height:1.3;
  display:flex;
  align-items:flex-start;
  overflow:auto;
  margin:0 16px;
  padding:8px 0;
  border-bottom:1px solid #e9e5df;
  list-style:none;
  li{
    margin-right:5px;
    font-size:12px;
    button{
      display:flex;
      border:none;
      background-color: white;
    }
  }
`;

const SocialActions=styled.div`
  align-items: center;
  display:flex;
  justify-content: flex-start;
  margin:0;
  min-height:40px;
  padding:4px 8px;
  button{
    display:inline-flex;
    align-items:center;
    padding:8px;
    color:#8a66c2;
    border:none;
    background-color:white;
    @media (min-width:768px){
      span{
        margin-left:8px;
      }
    }

    }
  
`;

const Content=styled.div`
  text-align:center;
  &>img{
    width:30px;

  }
`;


const Delete=styled.div`
z-index: 9999;
position:absolute;
top:10px;
background: white;
border-radius: 0 0 5px 5px;
width:70px;
height:40px;
font-size: 16px;
transition-duration: 167ms;
text-align: center;
display: none;
@media(max-width:768px){
    top:-5px;
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
export default Mainclg;
