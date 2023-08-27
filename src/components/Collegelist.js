import React from 'react'
import styled from 'styled-components'
const Collegelist = () => {
  return (
    <Container>
      <Layout>
        <Content>
            <Card>
            <img src="/images/user.svg" alt="" />
            <span>Shubham Choudhary</span>
            <AddPhotoText>Ludhiana,Punjab,India</AddPhotoText>
            <Button>
                <button><span> Follow</span></button>
            </Button>
            </Card>
            
        </Content>
      </Layout>
    </Container>
  )
}

const Container=styled.div`
    grid-area: main;
    
`;

const Layout=styled.div`
    background-color: #ffff;
    display:flex;
    height:100%;
    border-radius: 5px;
    box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);

`;

const Content=styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top:10px;
    margin-left:20px;
`;
const Card=styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width:fit-content;
    border-radius: 5px;
    margin:5px;
    margin-left:15px;
    box-shadow:2px 3px #888888;
    height:150px;
    background-color: #fff8;
    border:0.5px solid rgba(0,0,0,0.9);
    
        img{
            height:40px;
            margin-top: 10px;
            border-radius: 50%;
            
        }
    
    span{
        margin:5px;
        font-size:0.75rem;
    }
`;
const AddPhotoText=styled.div`
    color:#0a66c2;
    margin-top:4px;
    font-size:12px;
    line-height:1.33;
    font-weight:400;
`;

const Button=styled.div`
    margin-top:8px;
    margin-bottom: 8px;
    
    button{
      
        width:70%;
        border-radius: 30px;
        border:0;
        cursor:pointer;
        background-color: #0A66C2;
        height: 20px;
        span{
            /* display:flex;
            align-items: center;
            justify-content: center; */
            font-weight:600;
            
        }
    }

    button:hover{
        background-color: #0A55C3;
    }
`;
export default Collegelist;
