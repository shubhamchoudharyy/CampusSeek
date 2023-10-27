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
import {useCopyToClipboard} from 'usehooks-ts'
import { Spin,message } from 'antd';
import { host } from '../../assets/APIRoute';
import Articles from '../Articles';
const Mainclg = () => {
  const [showModel, setShowModel] = useState('close');
  const [post,setPost]=useState(null);
  
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {user}=useSelector((state)=>state.user)
  const [copy,setCopy]=useCopyToClipboard()
  useEffect(() => {
    if (!localStorage.getItem('token') ) {
      // Redirect to the login page if there's no token or user data
      navigate('/login');
    }
  }, [user, navigate]);
  // useEffect(()=>{
  //   if(user?.phone===0){
  //     navigate('/complete-login')
  //   }
  // },[user,navigate])
 const getPost = async () => {
    try {
      const res = await axios.post(`${host}/college/getpost`, { userId: user._id }, {
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

    
    if(postId===user._id){
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
  }
  if (!post) {
    return <Spin style={{ marginTop: '12px' }} />
  }
 

  return (
    <>
     
        <Container>
          <ShareBox>
            <div>
              {user && user?.photoUrl ? (
                <img src={user?.photoUrl} alt="User" />
              ) : (
                <img src="/images/user.svg" alt="User" />
              )}
              {/* <img src="/images/user.svg" alt="User" /> */}
              <button  onClick={handleClick} >
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
          {post?.length === 0 ? (
        <p>There are no articles</p>
      ) : (
          <Content>
            
            {post?.length > 0 &&
              post?.map((article) => (
                
                <Articles article={article} key={article._id}/>
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
    -webkit-box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
            box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
`;
const ShareBox=styled(CommonCard)`
  
display:-webkit-box;
  display:-ms-flexbox;
  display:flex;
  -webkit-box-orient:vertical;
  -webkit-box-direction:normal;
  -ms-flex-direction:column;
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
      display:-webkit-box;
      display:-ms-flexbox;
      display:flex;
      -webkit-box-align: center;
          -ms-flex-align: center;
              align-items: center;
      font-weight:600;



    }
    &:first-child{
      display:-webkit-box;
      display:-ms-flexbox;
      display:flex;
      -webkit-box-align:center;
          -ms-flex-align:center;
              align-items:center;
      padding:8px 16px 8px 16px;
      img{
        width:48px;
        border-radius:50%;
        margin-right:8px;

      }
      button{
        margin:4px 0;
        -webkit-box-flex: 1;
            -ms-flex-positive: 1;
                flex-grow: 1;
        border-radius:35px;
        padding-left:16px;
        border:1px solid rgba(0,0,0,0.15);
        background-color:white;
        text-align:left;
      }
    }
    &:nth-child(2){
      display:-webkit-box;
      display:-ms-flexbox;
      display:flex;
      -ms-flex-wrap: wrap;
          flex-wrap: wrap;
      -ms-flex-pack: distribute;
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

const Content=styled.div`
  text-align:center;
  &>img{
    width:30px;

  }
`;

export default Mainclg;
