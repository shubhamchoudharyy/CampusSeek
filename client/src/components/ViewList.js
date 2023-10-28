import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Table, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { host } from '../assets/APIRoute';
import { loadStripe } from '@stripe/stripe-js';

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
  
  
  const makePayment=async()=>{
    const stripe=await loadStripe("pk_test_51O5phpSFLLswxD1rH5SoGpRWFzjkKvHIaEhfh2jsvj9qYqkFwQDqBxanMi0CxhVJx51AMK8HWfAOLleLVbdZPX9600vdPZFLZO")

    const body={
      products:user
    }
    const headers={
      "Content-type":"application/json"
    }

    const res=await axios.post(`${host}/college/create-checout-session`,user);
    console.log(res)
  const session=res.data.id;
  const url=res.data.url;
  window.location=url
  


  const result =stripe.redirectToCheckout({
    sessionId:session.id
  })

  if(result.error){
    console.log(result.error )
  }
  }



  return (
    <Container>

      {!user?.premium && 
        <div > 
        <h1 style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>{users.length}</h1>
        <p style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>People viewed your profile</p>
        <p style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>To see who view your profile become a premium member</p>
        <p style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>Become a Premium member at Rs.1500 for a month </p>
        <Button>
          <button onClick={makePayment}><span>Pay</span></button>
          </Button>
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
        <TableContainer>
        <Table columns={columns} dataSource={reversedUsers} />
        </TableContainer>
      </Layout> 
    </Container>
  );
};

const Container = styled.div`
  grid-area: main;
  div{
    p{
      font-size: 0.8rem;
    }
  }
`;
const Layout = styled.div``;




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

    

const Button=styled.div`

display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-align: center;
-ms-flex-align: center;
        align-items: center;
-webkit-box-pack: center;
-ms-flex-pack: center;
        justify-content: center;
width: 100%;

    margin: 20px;
    align-items: center;
    justify-content:center;
    button{
        cursor:pointer;
        width:90px;
        height:30px;
        background-color:#0a66c2;
        border:0;
        border-radius: 20px;
        span{
            color:white;
            font-weight:600;
        }
    }
    button:hover{
        background-color: #0a55c3;
    }
`;


export default ViewList;
