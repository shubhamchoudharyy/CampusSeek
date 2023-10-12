import React, { useEffect } from 'react'
import styled from 'styled-components';
import LeftSide from './Users/Leftside';
import RightSide from './Users/Rightside';
import {connect, useSelector} from 'react-redux';
import { useNavigate } from 'react-router';
import Collegelist from './Collegelist'
import NotificationPage from './NotificationPage';



const Notification = (props) => {
    const navigate=useNavigate();
    const {user}=useSelector((state)=>state.user)
    useEffect(() => {
        if (!localStorage.getItem('token') ) {
          // Redirect to the login page if there's no token or user data
          navigate('/login');
        }
      }, [user, navigate]);
  return (
    <Container>
        
      <Layout>
      
      <NotificationPage/>
      <RightSide/>

      </Layout>
    </Container>
  )
}

const Container=styled.div`
    padding-top:52px;
    max-width:90%;
    margin-left: auto;
    margin-right:auto;

`;

const Content=styled.div`
    max-width: 1128px;
    margin-left:auto;
    margin-right: auto;
`;

const Section=styled.div`
    min-height: 50px;
    padding:16px 0;
    box-sizing: content-box;
    text-align:center;
    text-decoration: underline;
    display:flex;
    justify-content: center;
    h5{
        color:#0a66c2;
        font-size:16px;
        a{
        font-weight:14px;  
    }
    }

    p{
        font-size:14px;
        color:#434649;
        font-weight: 600;
    }

    @media (max-width:768px){
        flex-direction: column;
        padding:  0 5px;

       
    }
    
`;

const Layout=styled.div`
    display: grid;
    grid-template-areas: "leftside main rightside";
    /* grid-template-columns: minmax(0,5fr) minmax(0,5fr) minmax(300,7fr); */
    grid-template-columns: 10% 60% 30%;
    column-gap: 25px;
    row-gap:25px;
    /* grid-template-rows: auto; */
    margin: 25px 0;

    @media (max-width:768px){
        display: flex;
        flex-direction: column;
        padding: 0 5px;
    }

`;


// export default connect(mapStateToProps)
export default Notification;