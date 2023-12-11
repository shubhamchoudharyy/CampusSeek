import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Table,message } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { host } from '../../assets/APIRoute'

const CollegesRequest = () => {
    const {user}=useSelector((state)=>state.user)
    const navigate=useNavigate()
    const [college,setCollege]=useState([])
    const [search,setSearch]=useState("");

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

   
    const getColleges= async() =>{
        try{
            const res = await axios.get(`${host}/admin/getAllColleges`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(res.data.success){
                setCollege(res.data.data)
            }

        }catch(error){
            console.log(error)
        }
    };
    const handleDelete = async (record) => {
        try {
            const res = await axios.post(
                `${host}/admin/deleteAccount`,
                { collegeId: record._id, userId: record.userId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (res.data.success) {
                message.success(res.data.message);
                // Remove the deleted user from the state
                setCollege((prevCollege) => prevCollege.filter((collegeItem) => collegeItem._id !== record._id));
            }
        } catch (error) {
            message.error('Something Went Wrong');
        }
    };


    const handleAccountStatus=async(record,status)=>{
        try{
            const res=await axios.post(`${host}/admin/changeAccountStatus`,
            {collegeId:record._id,userId:record.userId,status:status},{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(res.data.success){
                message.success(res.data.message)
                setCollege(prevCollege => {
                    const updatedCollege = prevCollege.map(collegeItem => {
                        if (collegeItem._id === record._id) {
                            // Update the status for the specific college
                            return { ...collegeItem, status: status };
                        }
                        return collegeItem;
                    });
                    return updatedCollege;
                });
            }
        }catch(error){
            message.error('Something Went Wrong')
        }

    }

    const filteredUsers = search
    ? college.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (typeof user.phone === 'string' && user.phone.toLowerCase().includes(search.toLowerCase()))
      )
    : college;
    useEffect(()=>{
        getColleges();
    },[])

    const columns=[
        {
            title:'Name',
            dataIndex:'name',
            render: (text, record) => (
              <a onClick={()=>navigate(`/profileClg/${record?._id}`)}>{record.name}</a>
                
              ),
        },
        {
            title:'Status',
            dataIndex:'status',
        },
       
        {
            title:'Actions',
            dataIndex:'actions',
            render:(text,record)=>(
                <div className="d-flex">
                   {record.status ==='pending' ? <Button> <button  onClick={()=>handleAccountStatus(record,'approved')}><span> Approve </span></button> <button onClick={()=>handleDelete(record)}><span>Delete</span></button></Button> :
                   record.status ==='approved'? <Button><button  onClick={()=>handleAccountStatus(record,'reject')}> <span>Reject</span></button> <button onClick={()=>handleDelete(record)}><span>Delete</span></button> </Button>: <Button><button  onClick={()=>handleAccountStatus(record,'approved')}><span> Approve </span></button> <button onClick={()=>handleDelete(record)}><span>Delete</span></button> </Button>}
                   
                </div>

            )
        },
    ]
    console.log(filteredUsers);
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
 
  )
}

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

export default CollegesRequest;
