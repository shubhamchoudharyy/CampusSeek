import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Table,message } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CollegesRequest = () => {
    const {user}=useSelector((state)=>state.user)
    const navigate=useNavigate()
    const [college,setCollege]=useState([])

    useEffect(() => {
        if (!localStorage.getItem('token') ) {
          // Redirect to the login page if there's no token or user data
          navigate('/login');
        }
      }, [user, navigate]);

    const baseURL = "http://localhost:5000/api/v1"; // Example base URL

    const getColleges= async() =>{
        try{
            const res = await axios.get(`${baseURL}/admin/getAllColleges`,{
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
                `${baseURL}/admin/deleteAccount`,
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
            const res=await axios.post(`${baseURL}/admin/changeAccountStatus`,
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
    useEffect(()=>{
        getColleges();
    },[])

    const columns=[
        {
            title:'Name',
            dataIndex:'name',
            render: (text, record) => (
              <a onClick={()=>navigate(`/profileClg/${record._id}`)}>{record.name}</a>
                
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
  return (
    <>
    <h2 className='text-center m-2' style={{color:'white',width:'170vh'}}>College List</h2>
    <Table columns={columns} dataSource={college} />
    </>
 
  )
}

const Button=styled.div`
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
export default CollegesRequest;
