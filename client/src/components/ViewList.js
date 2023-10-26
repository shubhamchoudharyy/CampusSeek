import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Table, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { host } from '../assets/APIRoute';

const ViewList = () => {
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
    console.log("getting users")
    try {
      const res = await axios.post(`${host}/college/getViews/${params.id}`, {
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



  const filteredUsers = search
  ? users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (typeof user.phone === 'string' && user.phone.toLowerCase().includes(search.toLowerCase()))
    )
  : users;
  const reversedUsers = [...filteredUsers].reverse();
  

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        user?.premium && <span>{record.name}</span> 
        
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text, record) => (
        user?.premium && <span>{record.email}</span> 
         
       ),
    },
  
    {
        title: 'Phone',
        dataIndex: 'phone',
        render: (text, record) => (
            user?.premium && <span>{record.phone}</span> 
        ),
      },
    
   
  ];
  console.log(users.length)
  



  return (
    <Container>

      {!user?.premium && 
        <div > 
        <h1 style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>{users.length}</h1>
        <p style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>People viewed your profile</p>
        <p style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>To see who view your profile become a premium member</p>
        </div>
      }

      {user?.premium && <Search>
                <div>
                    <input type="text" placeholder='Search' value={search} 
                    onChange={(e)=>setSearch(e.target.value)} name="" id="" />
                </div>
                <SearchIcon>
                    
                    <img src="/images/search-icon.svg" alt="" />
                </SearchIcon>
            </Search>}
      
         
      <Layout>
         <h2 className="text-center " style={{ color: 'white', width: '170vh' }} >Users List</h2> 
        <Table columns={columns} dataSource={reversedUsers} />
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

const Search=styled.div`
    opacity:1;
    flex-grow: 1;
    position:relative;
    &>div{
        max-width: 200px;
        input{
            border:none;
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
    display:flex;
    justify-content: center;
    align-items:center;
    
    `;

export default ViewList;