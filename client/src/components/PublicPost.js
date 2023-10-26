import React, { useState ,useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios'
import { useCopyToClipboard } from 'usehooks-ts';
import ReactPlayer from 'react-player';
import { message } from 'antd';
import { host } from '../assets/APIRoute';

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
        <Article>
        <SharedActors >
                    <a onClick={()=>navigate(`/user-search/${post?.userId}`)}>
                      <img src={post?.photoUrl} alt="Actor" />
                      <div>
                        <span>{post?.name}</span>
                        <span>{post?.email}</span>
                        <span>{post?.date}</span>
                      </div>
                    </a>
                    
                    <User>
                    <button>...</button>
                    <Share>
                      <a onClick={()=>{
                        setCopy(`http://localhost:3000/post/${post?._id}`)
                        message.success("Copied")
                      }}>Copy URL</a>
                    </Share>
                    </User>
                    
                  </SharedActors>
                  <Descriptions>{post?.description}</Descriptions>
                  <SharedImg>
                    <a>
                      {!post?.image && post?.video ? (
                        <ReactPlayer width={'100%'} url={post?.video} controls/>
                      ) : (
                        post?.image && <img src={post?.image} alt="Shared" />
                      )}
                      {/* <img src='/images/shivji.jpg' alt="shared"/> */}
                    </a>
                  </SharedImg>
                 
                  
                </Article>:
                <p>There are no articles</p>
            }
      
    </Container>
  )
}

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
  cursor: pointer;
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
const Share=styled.div`
  z-index: 9999;
  background-color: red;
position:absolute;
cursor:pointer;
top:0px;
background: white;
border-radius: 0 0 5px 5px;
width:70px;
height:40px;
font-size: 0.7rem;
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
    cursor: pointer;
    

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
        ${Share}{
            align-items:center;
            display:flex;
            justify-content: center;
        }
        
        
    }
`;

export default PublicPost
