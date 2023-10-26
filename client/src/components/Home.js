import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LeftSide from './Users/Leftside';
import Main from './Users/Main';
import RightSide from './Users/Rightside';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Mainclg from './College/Mainclg';
import MainAdmin from './admin/MainAdmin';

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Create a state variable to serve as the "key" for forcing re-renders
  const [rerenderKey, setRerenderKey] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      // Redirect to the login page if there's no token or user data
      navigate('/login');
    }
  }, [user, navigate]);

  // useEffect(() => {
  //   if (user?.phone === 0) {
  //     navigate('/complete-login');
  //   }
  // }, [user, navigate]);

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

const Content = styled.div`
  max-width: 1128px;
  margin-left: auto;
  margin-right: auto;
`;

const Section = styled.div`
  min-height: 50px;
  padding: 16px 0;
  box-sizing: content-box;
  text-align: center;
  text-decoration: underline;
  display: flex;
  justify-content: center;
  h5 {
    color: #0a66c2;
    font-size: 16px;
    a {
      font-weight: 14px;
    }
  }

  p {
    font-size: 14px;
    color: #434649;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 5px;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-areas: "leftside main rightside";
  grid-template-columns: 30% 40% 30%;
  column-gap: 25px;
  row-gap: 25px;
  margin: 25px 0;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 5px;
  }
`;

export default Home;
