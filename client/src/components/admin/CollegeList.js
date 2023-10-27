import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Table, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { host } from '../../assets/APIRoute';

const CollegeList = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search,setSearch]=useState("");
  const params=useParams();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      // Redirect to the login page if there's no token or user data
      navigate('/login');
    }
  }, [user, navigate]);
  useEffect(()=>{
    if(user?.phone===0){
      navigate('/complete-login')
    }
  },[user,navigate])

  

  const getUsers = async () => {
    try {
      const res = await axios.get(`${host}/admin/getAllUsers`, {
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
        `${host}/admin/deleteAccountStatus/${userId}`,
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

  const filteredUsers = search
  ? users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (typeof user.phone === 'string' && user.phone.toLowerCase().includes(search.toLowerCase()))
    )
  : users;
  
  console.log(users)
  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        record.isCollege? <a onClick={()=>navigate(`/user-search/${record._id}`)}>{record.name}</a>:
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
      <Search>
                <div>
                    <input type="text" placeholder='Search' value={search} 
                    onChange={(e)=>setSearch(e.target.value)} name="" id="" />
                </div>
                <SearchIcon>
                    
                    <img src="/images/search-icon.svg" alt="" />
                </SearchIcon>
            </Search>
      
         
      <Layout>
        <TableContainer>
        <Table columns={columns} dataSource={filteredUsers} />
        </TableContainer>
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

const TableContainer=styled.div`
  @media (max-width:768px) {
   height :400px ;
   overflow-y: scroll;
  }
`;

const Search=styled.div`
    
opacity:1;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
            flex-grow: 1;
    position:relative;
    &>div{
        max-width: 200px;
        input{
            border:none;
            -webkit-box-shadow:none;
                    box-shadow:none;
            background-color:#eef3f8;
            border-radius: 2px;
            color:rgba(0,0,0,0.9);
            width:218px;
            padding:0 8px 0 40px;
            line-height: 1.75;
            font-weight: 400;
            font-size:14px;
            height:34px;
            border-color:#dce6f1;
            vertical-align:text-top;
            
        }
    }
`;

const SearchIcon=styled.div`
   
 width:40px;
    position:absolute;
    z-index:1;
    top:10px;
    left:2px;
    border-radius:0 2px 0 2px;
    margin:0;
    pointer-events: none;
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-align:center;
    -ms-flex-align:center;
            align-items:center;
    
    `;

export default CollegeList;
