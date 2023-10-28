import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LeftSide from './Users/Leftside';
import Main from './Users/Main';
import RightSide from './Users/Rightside';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Mainclg from './College/Mainclg';
import MainAdmin from './admin/MainAdmin';
import { host } from '../assets/APIRoute';
import axios from 'axios'

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [rerenderKey, setRerenderKey] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('token')) {

      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.phone === 0) {
      navigate('/complete-login');
    }
  }, [user, navigate]);

  if(user?.premium && user?.isCollege){

  }
  useEffect(()=>{
    
  if(user?.premium && user?.isCollege){
    const checkPremium=async()=>{
      try{
        const res=await axios.post(`${host}/college/premiumcheck`,{
          userId:user?._id
        });
        if(res.data.success){
          window.location.reload();
        }

      }catch(e){
        console.log(e);
      }
    }
    checkPremium();
  }
   
  },[])

  const isAdmin = user ? user.isAdmin : false;
  const isCollege = user ? user.isCollege : false;

  

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Layout>
        <LeftSide />
        {isCollege ? (
          <Mainclg key={rerenderKey} props={user} />
        ) : isAdmin ? (
          <MainAdmin key={rerenderKey} props={user} />
        ) : (
          <Main key={rerenderKey} props={user} />
        )}
        <RightSide />
      </Layout>
    </Container>
  );
};

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

export default Home;
