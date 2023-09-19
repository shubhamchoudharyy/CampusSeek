import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Table, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const CollegeList = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const params=useParams();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      // Redirect to the login page if there's no token or user data
      navigate('/login');
    }
  }, [user, navigate]);

  const baseURL = "http://localhost:5000/api/v1";

  const getUsers = async () => {
    try {
      const res = await axios.get(`${baseURL}/admin/getAllUsers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountStatus = async (userId) => {
    const collegeId= userId;
    console.log(user._id);
    console.log(collegeId);
    try {
      const res = await axios.post(
        `${baseURL}/admin/deleteAccountStatus/${userId}`,
         // Send userId and requestingUserId correctly
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        // Update the state to remove the deleted user
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      message.error('Something Went Wrong');
    }
  };
  
  
  

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        record.isCollege? <a onClick={()=>navigate(`/search/${record._id}`)}>{record.name}</a>:
        <a onClick={()=>navigate(`/profile/${record._id}`)}>{record.name}</a>
        
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'College',
      dataIndex: 'isCollege',
      render: (text, record) => <span>{record.isCollege ? 'Yes' : 'No'}</span>,
    },
    // {
    //   title: 'id',
    //   dataIndex: '_id',
    //   render: (text, record) => <span>{record._id}</span>,
    // },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          <Button>
            <button onClick={() => handleAccountStatus(record._id)}> <span>Delete</span></button>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container>
      <Layout>
        {/* <h2 className="text-center " style={{ color: 'white', width: '170vh' }} >Users List</h2> */}
        <Table columns={columns} dataSource={users} />
      </Layout>
    </Container>
  );
};

const Container = styled.div`
  grid-area: main;
`;
const Layout = styled.div``;




const Button = styled.div`
    button{
        border-radius: 8px;
        background-color: #0a66c3;
        border: 0;
        padding: 5px;
        cursor: pointer;
        span{
            color:white;
        }
    }
`;

export default CollegeList;
