import React,{useState} from 'react'
import styled from 'styled-components'
// import PostModel from './PostModel'
import { connect, useSelector } from 'react-redux';
import {useEffect} from 'react';
import {Spin,message} from 'antd'
import axios from 'axios'
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from 'usehooks-ts';
import { host } from '../../assets/APIRoute';
import Articles from '../Articles';
const MainAdmin = (props) => {


  const {user}=useSelector((state)=>state.user)
  const [post,setPost]=useState(null);
  
  const [copy,setCopy]=useCopyToClipboard()
  const navigate=useNavigate();
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
      const res = await axios.post(`${host}/admin/getpost`, { userId: user?._id }, {
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
  

  if (!post) {
    return <Spin style={{ marginTop: '12px' }} />
  }
 
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




  return (
    <>
      {!post ? (
        <p>There are no articles</p>
      ) : (
        <Container>
         
          <Content>
       
            {post &&
              post.map((article) => (
                
                <Articles article={article} key={article._id} />
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





export default MainAdmin;