import React, { useEffect } from 'react'
import styled from 'styled-components';
import {connect, useSelector} from 'react-redux';
import { useNavigate } from 'react-router';
import ProfileClg from './ProfileClg';
import Leftside from '../Users/Leftside';
import Rightside from '../Users/Rightside';



const CollegeProfile = () => {
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

      <ProfileClg/>
      <Rightside/>

      </Layout>
    </Container>
  )
}

const Container = styled.div`
  padding-top: 52px;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
`;


const Layout = styled.div`
  display: -ms-grid;
  display: grid;
  grid-template-areas: "leftside main rightside";
  grid-template-columns: 20% 50% 30%;
  -webkit-column-gap: 25px;
  -moz-column-gap: 25px;
          column-gap: 25px;
  row-gap: 25px;
  margin: 25px 0;

  @media (max-width: 768px) {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    padding: 0 5px;
  }
`;

export default CollegeProfile;
