import React from 'react'
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useCopyToClipboard } from 'usehooks-ts';
import { host } from '../assets/APIRoute';
import axios from 'axios';


const Articles = (props) => {
  const {user}=useSelector((state)=>state.user)
  const navigate=useNavigate();
  const [copy,setCopy]=useCopyToClipboard();


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
    console.log(props.article)

  return (
    <>
       <Article key={props.article?._id} >
                  <SharedActors >
                    <a onClick={()=>navigate(`/user-search/${props.article?.userId}`)}>
                      <img src={props.article?.photoUrl} alt="Actor" />
                      <div>
                        <span>{props.article?.name}</span>
                        <span>{props.article?.email}</span>
                        <span>{props.article?.date}</span>
                      </div>
                    </a>
                    {user?._id===props.article?.userId ?
                    <User>
                    <button>...</button>
                    <Share>
                      <a onClick={()=>{
                        setCopy(`http://localhost:3000/post/${props.article?._id}`)
                        message.success("Copied")
                      }}>Copy URL</a>
                    </Share>
                    
                    <Delete >
                      <a onClick={()=>handleDeletePost(props.article?.userId,props.article?._id)}>Delete</a>
                    </Delete>
                    </User> :
                    <User>
                    <button>....</button>
                    <Share>
                      <a onClick={()=>{
                        setCopy(`http://localhost:3000/post/${props.article?._id}`)
                        message.success("Copied")
                      }}>Copy URL</a>
                    </Share>
                    </User>} 
                  </SharedActors>
                  <Descriptions>
                    {props.article.style==="bold"? <span style={{fontWeight:"bold"}}> {props.article?.description}</span>:
                    props.article.style==="underline" ? <span style={{textDecoration:"underline"}}>{props.article?.description}</span>:
                    props.article.style==="cursive" ? <span style={{fontFamily:"cursive"}}>{props.article?.description}</span>:
                    props.article.style==="italic" ? <span style={{fontStyle:"italic"}}>{props.article?.description}</span>:
                    <span>{props.article.description}</span>
                    }</Descriptions>
                  <SharedImg>
                    <a>
                      {!props.article?.image && props.article?.video ? (
                        <ReactPlayer width={'100%'} url={props.article?.video} controls/>
                      ) : (
                        props.article?.image && <img src={props.article?.image} alt="Shared" />
                      )}
                      
                     </a>
                </SharedImg> 
                 
                  
                </Article> 
    </>
  )
}

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
const Article=styled(CommonCard)`
  padding:0;
  margin:0 0  8px;
  overflow:visible;
`;

const SharedActors=styled.div`
  
padding:40px;
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

const Descriptions=styled.div`
padding:0 16px;
overflow:hidden;
color:rgba(0,0,0,0.9);
font-size:16px;
text-align:left;
 white-space: pre-wrap;
 font-size: 0.8rem;

`;

const SharedImg=styled.div`
  
margin-top:8px;
  width:100%;
  display:block;
  position:relative;
  background-color: #f9fafb;
  img{
    -o-object-fit:contain;
       object-fit:contain;
    width:100%;
    height:100%;
  }
`;





const Delete=styled.div`

z-index: 9999;
position:absolute;
cursor:pointer;
top:30px;
background: white;
border-radius: 0 0 5px 5px;
width:70px;
height:40px;
font-size: 0.7rem;
-webkit-transition-duration: 167ms;
-o-transition-duration: 167ms;
        transition-duration: 167ms;
text-align: center;
display: none;
@media(max-width:768px){
    top:25px;
    right:5px
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
-webkit-transition-duration: 167ms;
-o-transition-duration: 167ms;
        transition-duration: 167ms;
text-align: center;
display: none;
@media(max-width:768px){
    top:-5px;
    right:5px
}
`;



const NavList=styled.li`
    
display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -webkit-box-align:center;
    -ms-flex-align:center;
            align-items:center;
    

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
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;;
        -webkit-box-align:center;;
            -ms-flex-align:center;;
                align-items:center;
    }

    &:hover{
        ${Share}{
          -webkit-box-align:center;
                -ms-flex-align:center;
                    align-items:center;
            display:-webkit-box;
            display:-ms-flexbox;
            display:flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
        }
        ${Delete}{
          -webkit-box-align:center;
                -ms-flex-align:center;
                    align-items:center;
            display:-webkit-box;
            display:-ms-flexbox;
            display:flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
        }
    }
`;

export default Articles
