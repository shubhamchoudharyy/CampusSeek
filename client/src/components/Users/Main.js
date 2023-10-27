import React,{useState} from 'react'
import styled from 'styled-components'
// import PostModel from './PostModel'
import { connect, useSelector } from 'react-redux';
import {useEffect} from 'react';
// import { getArticleAPI } from '../actions';
import ReactPlayer from 'react-player';
import axios from 'axios'
import {Spin,message} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from 'usehooks-ts';
import { host } from '../../assets/APIRoute';
import Articles from '../Articles';
const Main = () => {
  const [showModel, setShowModel] = useState('close');
  const {user}=useSelector((state)=>state.user)
  const [post,setPost]=useState(null)
  const navigate=useNavigate()
  const [copy,setCopy]=useCopyToClipboard();

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
  
 
  useEffect(() => {
    getPost();
    // Fetch posts periodically every 30 seconds
    const intervalId = setInterval(getPost, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [user?._id]);
 

  return (
    <>
      {!post ? (
        <p>There are no articles</p>
      ) : (
        <Container>
          
          <Content>
            
            {post?.length > 0 &&
              post.map((article, key) => (
                  
                <Articles article={article} key={article._id}/>
              ))} 
          </Content>
   
        </Container>
      )} 
    </>
  );
};


const Container=styled.div`
    grid-area: main;
`;



const Content=styled.div`
  text-align:center;
  &>img{
    width:30px;

  }
`;



export default Main;