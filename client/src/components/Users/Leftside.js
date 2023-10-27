import React, { useEffect } from 'react'
import {connect, useSelector } from 'react-redux'
import styled from 'styled-components'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const Leftside = () => {
    const {user}=useSelector((state)=>state.user);
    const navigate=useNavigate();
    
  
   
  return (
    <Container>
    <ArtCard>
      <UserInfo>
          <CardBackground/>
              <a>
              <Photo>
                {user?.photoUrl? <img src={user?.photoUrl} alt="User" />:
                <img src='/images/photo.svg' alt="User" />
                }
                
                </Photo>
                
                  
                  <Link>Welcome, {user?.name}</Link>
              </a>
              <a>
                  {/* <AddPhotoText>Add a photo</AddPhotoText> */}
              </a>
      </UserInfo>
      <Widget >
          <a onClick={()=>navigate(`/colleges/${user._id}`)} >
              <div>
                  <span>Connections</span>
                  <span>Grow your network</span>
              </div>
              <img src="/images/widget-icon.svg" alt="" />
          </a>
      </Widget>
      <Item onClick={()=>navigate(`/mycollege/${user._id}`)}>
          <span >
              <img src="/images/item-icon.svg" alt="" />
              My Colleges
          </span>
      </Item>
    </ArtCard>

   

  </Container>
)
}


const Container=styled.div`
grid-area: leftside;
`;

const ArtCard=styled.div`
   
 text-align:center;
    overflow: hidden;
    margin-bottom: 8px;
    background-color: #fff;
    border-radius: 5px;
    -webkit-transition:-webkit-box-shadow 83ms;
    transition:-webkit-box-shadow 83ms;
    -o-transition:box-shadow 83ms;
    transition:box-shadow 83ms;
    transition:box-shadow 83ms, -webkit-box-shadow 83ms;
    position: relative;
    -webkit-box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
            box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);

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

const Photo = styled.div`
  
img {
    -webkit-box-shadow: none;
            box-shadow: none;
    width: 72px;
    height: 72px;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    background-clip: content-box;
    background-color: white;
    background-position: center;
    background-size: 60%;
    background-repeat: no-repeat;
    border: 2px solid white;
    margin: -38px auto 12px;
    border-radius: 50%;
  }
`;

const Link=styled.div`
    font-size:13px;
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

const Widget=styled.div`
   
 border-bottom: 1px solid rgba(0,0,0,0.15);
    padding-top:12px;
    padding-bottom:12px;

    &>a {
        text-decoration:none;
        display:-webkit-box;
        display:-ms-flexbox;
        display:flex;
        -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                justify-content: space-between;
        -webkit-box-align:center;
            -ms-flex-align:center;
                align-items:center;
        padding:4px 12px;
        cursor: pointer;

        &:hover{
            background-color:rgba(0,0,0,0.08);
        }

        div{
            display:-webkit-box;
            display:-ms-flexbox;
            display:flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            text-align:left;
            span{
                font-size:12px;
                line-height:1.333;
                 &:first-child{
                    color:rgba(0,0,0,0.6);
                }
                &:nth-child(2){
                    color:rgba(0,0,0,1);
                } 
            } 
        }
    }

    svg{
        color:rgba(0,0,0,1);
    }
`;

const Item=styled.a`
   border-color:rgba(0,0,0,0.8);
    text-align:left;
    padding:12px;
    font-size:12px;
    display: block;
    cursor: pointer;
    span{
        display:-webkit-box;
        display:-ms-flexbox;
        display:flex;
        -webkit-box-align:center;
            -ms-flex-align:center;
                align-items:center;
        color:rgba(0,0,0,1);
        svg{
            color:rgba(0,0,0,0.6);
        }
    }

    &:hover{
        background-color:rgba(0,0,0,0.8);
    }
`;





export default Leftside;
