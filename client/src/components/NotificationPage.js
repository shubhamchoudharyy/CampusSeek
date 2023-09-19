import React from 'react';

import { Tabs, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
const NotificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const baseURL = "http://localhost:5000/api/v1";
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading()); // Assuming loading state is handled by showLoading action
      const res = await axios.post(
        `${baseURL}/user/get-all-notification`,
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
        `${baseURL}/user/delete-all-notification`,
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
      {/* <h2 className='text-center' style={{ marginTop: '', color: 'white', width: '170vh' }}>Notifications</h2> */}
      <Align >
        {/* <Tabs.TabPane tab={<span >Unread</span>} key={0}> */}
          {/* <div className='d-flex justify-content-end'>
            <h4
              className='p-2 text-primary'
              style={{ cursor: 'pointer' }}
              onClick={handleMarkAllRead}
            >
              Mark All Read
            </h4>
          </div> */}
          {user?.notification.map((notificationMsg) => (
            <Block
              
              key={notificationMsg._id}
              onClick={() => navigate(notificationMsg.onClickPath)}
              
            >
              <Card><span>{notificationMsg.message}</span></Card>
            </Block>
          ))}
        {/* </Tabs.TabPane> */}
        {/* <Tabs.TabPane tab={<span >Read</span>} key={1}>
          <div className='d-flex justify-content-end'>
            <h4
              className='p-2 text-primary'
              style={{ cursor: 'pointer' }}
              onClick={handleDeleteAllRead}
            >
              Delete All Read
            </h4>
          </div>
          {user?.seennotification.map((notificationMsg) => (
            <div
              className='d-flex'
              key={notificationMsg._id}
              onClick={() => navigate(notificationMsg.onClickPath)}
              style={{ cursor: 'pointer', margin: '3%', color: 'white' }}
            >
              <Card><span>{notificationMsg.message}</span></Card>
            </div>
          ))}
        </Tabs.TabPane> */}
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
    box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
`;
const Card=styled.div`
    width:fit-content;
    padding: 5px;
    /* box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%); */
    span{
        font-weight: 700;
        margin-top:2px ;
        align-items: start;
        justify-content: start;
        color:rgba(0,0,0,0.6);
        
    }
`;

const Block=styled.div`
    
    width: 98%;
    height:40px;
    box-shadow:0 0 0 1px rgba(0 0 0/15%), 0 0 0 rgba(0 0 0/20%);
    margin: 5px;
    overflow-x:hidden;
`;

const Align=styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;
export default NotificationPage;
