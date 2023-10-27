import React from 'react';

import { Tabs, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import { host } from '../assets/APIRoute';
const NotificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);


  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading()); // Assuming loading state is handled by showLoading action
      const res = await axios.post(
        `${host}/user/get-all-notification`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading()); // Assuming hideLoading action hides the loading state
      if (res.data.success) {
        window.location.reload();
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading()); // Assuming hideLoading action hides the loading state
      console.log(error);
      message.error('Something went Wrong');
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading()); // Assuming loading state is handled by showLoading action
      const res = await axios.post(
        `${host}/user/delete-all-notification`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading()); // Assuming hideLoading action hides the loading state
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading()); // Assuming hideLoading action hides the loading state
      console.log(error);
      message.error('Something Went Wrong');
    }
  };

  return (
    <Conatiner>
    <Layout>

      <Align >
        
          {user?.notification.slice().reverse().map((notificationMsg) => (
          <Block
            key={notificationMsg._id}
            onClick={() => navigate(notificationMsg.onClickPath)}
          >
            <Card><span>{notificationMsg.message}</span></Card>
          </Block>
        ))}

       
      </Align>
    </Layout>
    </Conatiner>
  );
};

const Conatiner=styled.div`
    grid-area: main;
`;

const Layout=styled.div`
   
 width: 100%;
    height: 100vh;
    -webkit-box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
            box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
`;
const Card=styled.div`
    
width:-webkit-fit-content;
    width:-moz-fit-content;
    width:fit-content;
    padding: 5px;
    /* box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%); */
    span{
        font-weight: 500;
        margin-top:2px ;
        -webkit-box-align: start;
            -ms-flex-align: start;
                align-items: start;
        -webkit-box-pack: start;
            -ms-flex-pack: start;
                justify-content: start;
        font-size: 0.8rem;
        
    }
`;

const Block=styled.div`
   
   width: 98%;
    height:40px;
    -webkit-box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
            box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
    margin: 5px;
    overflow-x:hidden;
`;

const Align=styled.div`
   
 display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
            flex-direction: column;
    -webkit-box-align: start;
    -ms-flex-align: start;
            align-items: flex-start;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
            justify-content: flex-start;
`;
export default NotificationPage;
