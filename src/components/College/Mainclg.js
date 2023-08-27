import React,{useState} from 'react'
import styled from 'styled-components'
import PostModel from './PostModel'
import { connect } from 'react-redux';
import {useEffect} from 'react';
// import { getArticleAPI } from '../actions';
import ReactPlayer from 'react-player';
import { combineReducers } from 'redux';
const Mainclg = (props) => {
  const [showModel, setShowModel] = useState('close');

//   useEffect(() => {
//     props.getArticles();
//   }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }
    setShowModel((prevState) => (prevState === 'open' ? 'close' : 'open'));
  };

  return (
    <>
      {/* {props.articles.length === 0 ? (
        <p>There are no articles</p>
      ) : ( */}
        <Container>
          <ShareBox>
            <div>
              {/* {props.user && props.user.photoURL ? (
                <img src={props.user.photoURL} alt="User" />
              ) : (
                <img src="/images/user.svg" alt="User" />
              )} */}
              <img src="/images/user.svg" alt="User" />
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
                <img src="/images/event-icon.svg" alt="" />
                <span>Event</span>
              </button>
              <button>
                <img src="/images/article-icon.svg" alt="" />
                <span>Web Article</span>
              </button>
            </div>
          </ShareBox>
          <Content>
            {/* {props.loading && <img src="./images/spin-loader.svg" alt="Loading" />}
            {props.articles.length > 0 &&
              props.articles.map((article, key) => ( */}
                <Article >
                  <SharedActors>
                    <a>
                      <img src='/images/user.svg' alt="Actor" />
                      <div>
                        <span>Title</span>
                        <span>gndec@gmail.combineReducers</span>
                        <span>Date</span>
                      </div>
                    </a>
                    <button>...</button>
                  </SharedActors>
                  <Descriptions>Description</Descriptions>
                  <SharedImg>
                    <a>
                      {/* {!article.shareImg && article.video ? (
                        <ReactPlayer width={'100%'} url={article.video} />
                      ) : (
                        article.shareImg && <img src={article.shareImg} alt="Shared" />
                      )} */}
                      <img src='/images/shivji.jpg' alt="shared"/>
                    </a>
                  </SharedImg>
                  <SocialCounts>
                    <li>
                      <button>
                        <img
                          src="https://static-expl.licdn.com/sc/h/d310t2g24pvdy4pt1jkedo4yb"
                          alt=""
                        />
                        <img
                          src="https://static-expl.licdn.com/sc/h/5thsbmikm6a8uov24ygwd914f"
                          alt=""
                        />
                        <span>75</span>
                      </button>
                    </li>
                    <li>
                      <a>0</a>
                    </li>
                  </SocialCounts>
                  <SocialActions>
                    <button>
                      <img src="/images/like-icon.svg" alt="" />
                      <span>Likes</span>
                    </button>
                    <button>
                      <img src="/images/comments-icon.svg" alt="" />
                      <span>Comments</span>
                    </button>
                    <button>
                      <img src="/images/share-icon.svg" alt="" />
                      <span>Share</span>
                    </button>
                    <button>
                      <img src="/images/send-icon.svg" alt="" />
                      <span>Send</span>
                    </button>
                  </SocialActions>
                </Article>
              {/* ))} */}
          </Content>
          {/* <PostModel showModel={showModel} handleClick={handleClick} /> */}
        </Container>
      {/* )} */}
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
        border-radius:58%;
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

// const mapStateToProps=(state)=>{
//   return{
//     loading:state.articleState.loading,
//     user:state.userState.user,
//     articles:state.articleState.articles,
//   };
// };

// const mapDispatchToProps=(dispatch)=>{
//   return{
//     getArticles:()=>dispatch(getArticleAPI()),
//   }
// }
// export default connect(mapStateToProps,mapDispatchToProps)(Main)
export default Mainclg;
