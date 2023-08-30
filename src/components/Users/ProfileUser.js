import React from 'react'
import styled from 'styled-components';
const ProfileUser = () => {
  return (
    <Container>
    <Layout>
    <UserInfo>
      <CardBackground/>
          <a>
              <Photo/>
              <Link>Shubham Choudhary</Link>
          </a>
          <a>
              <AddPhotoText></AddPhotoText>
          </a>
         
  </UserInfo>
  <Cred>
  <fieldset>
  <legend>About</legend>
    <About>
        
        <input type="text" name="name" placeholder='Name'  id="" />
        <br />
        
        
        <input type="email" name="email" placeholder='E-mail'  id="" />
        <br />
        
        <input type="number" name="phone" placeholder='Phone no'  id="" />
        <br />

        

    </About>
    </fieldset>
  </Cred>
  </Layout>
  </Container>
  )
}



const Container=styled.div`
    grid-area:main;
`;
const Layout=styled.div`
    background-color: #ffff;
    display:flex;
    height:100%;
    border-radius: 5px;
    flex-direction: column;
    box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);

`;


const UserInfo=styled.div`
    border-bottom:1px solid rgba(0,0,0,0.15);
    padding:12px 12px 16px;
    word-wrap: break-word;
    word-break:break-word;
    width:100%;

`;

const CardBackground=styled.div`
    background:url("/images/card-bg.svg");
    background-position: center;
    background-size:462px;
    height:54px;
    max-width:100%;
    margin:-12px -12px 0;
`;

const Photo=styled.div`
    box-shadow:none;
    background-image: url("/images/photo.svg");
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

const Cred=styled.div`
    display:flex;
    align-items: flex-start;
    flex-direction:column;
    padding-left:20px;
    padding-top: 20px;
    padding-bottom:20px;
    box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
    
    fieldset{
        border:0;
        border-radius:5px;
        box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
        width:90%;

    }
    legend{
        font-weight:600;
    }

    
`;

const About=styled.form`
    
    textarea,input{
        height:40px;
        margin:10px;
        width:80%;
        border-top:0;
        border-left: 0;
        border-right: 0;
    }

`;

export default ProfileUser
