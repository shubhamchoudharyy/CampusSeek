import React, { useEffect } from 'react'
import styled from 'styled-components';
import LeftSide from './Users/Leftside';
import RightSide from './Users/Rightside';
import {connect, useSelector} from 'react-redux';

import Mycollegelist from './Mycollegelist';
import { useNavigate } from 'react-router-dom';



const MyColleges = (props) => {
  const {user}=useSelector((state)=>state.user);
  const navigate=useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('token') ) {
      // Redirect to the login page if there's no token or user data
      navigate('/login');
    }
  }, [user, navigate]);
  useEffect(()=>{
    if(user?.phone===0){
      navigate('/complete-login')
    }
  },[user,navigate])

  return (
    <Container>
        
      <Layout>
      <LeftSide/>
      <Mycollegelist/>
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
    /* grid-template-columns: minmax(0,5fr) minmax(300,5fr) minmax(0,7fr); */
    grid-template-columns: 30% 40% 30%;
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

const mapStateToProps=(state)=>{
    return{
        user: state.userState.user,
    }
}
// export default connect(mapStateToProps)
export default MyColleges;
