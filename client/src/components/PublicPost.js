import React, { useState ,useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios'
import { useCopyToClipboard } from 'usehooks-ts';
import ReactPlayer from 'react-player';
import { message } from 'antd';
import { host } from '../assets/APIRoute';
import Articles from './Articles';

const PublicPost = () => {
    const [post,setPost]=useState();
    const [copy,setCopy]=useCopyToClipboard();
    const params=useParams();
    const navigate=useNavigate();
  

    useEffect(()=>{

        const getPost=async()=>{
            try{
                const res=await axios.post(`${host}/college/onePost/${params.id}`);
                if(res.data.success){
                    setPost(res.data.data);
                }
            }catch(error){
                console.log(error);
            }
            
        }

        getPost();
    },[]);

   

  return (
    <Container>
        {post? 
        <Articles article={post}/>:
                <p>There are no articles</p>
            }
      
    </Container>
  )
}

const Container=styled.div`
    grid-area: main;
`;



export default PublicPost
