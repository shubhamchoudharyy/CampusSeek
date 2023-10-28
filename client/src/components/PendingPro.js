import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, message, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { host } from '../assets/APIRoute';

const PendingPro = () => {
  const { user } = useSelector((state) => state.user);
  const [values, setValues] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  


  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(()=>{
    if(user?.phone===0){
      navigate('/complete-login')
    }
  },[user,navigate])


  

  

  useEffect(() => {
    const getUserInfo = async () => {
        try {
          const res = await axios.post(
            `${host}/college/pendinginfo/${params.id}`,
          
            // {
            //   headers: {
            //     Authorization: `Bearer ${localStorage.getItem('token')}`,
            //   },
            // }
          );
          if (res.data.success) {
            setValues(res.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
    getUserInfo();
  }, [params.id]);
  
  if(!values){
    return <Spin style={{marginTop:'12px'}}/>
  }

  
  const handleVerify = async () => {
    try {
      const res = await axios.post(`${host}/admin/verify/${values?.college?.userId}`);
      if (res.data.success) {
        message.success("Changed");
        // Update the local state with the new values returned from the API
        setValues((prevValues) => ({ ...prevValues, verified: !prevValues.verified }));
      } else {
        message.error("Some error occurred");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handlePremium = async () => {
    try {
      const res = await axios.post(`${host}/admin/premium/${values?.college?.userId}`);
      if (res.data.success) {
        message.success("Changed");
        // Update the local state with the new values returned from the API
        setValues((prevValues) => ({ ...prevValues, premium: !prevValues.premium }));
      } else {
        message.error("Some Error occurred");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const premiumBuy=new Date(values?.premiumBuy)
  const expired=new Date(values?.expired)
  
  const history=values.history;
 
  return (
    <Container>
      <Layout>
        <UserInfo>
          <CardBackground />
          <a>
            <Photo>
              {values.photoUrl?
              <img src={values?.college?.photoUrl}/> :
              <img src='/images/photo.svg'/>}
            </Photo>
            <Links >{values?.college?.name}</Links>
          </a>
          <a>
            <AddPhotoText>
              
            </AddPhotoText>
          </a>
        </UserInfo>
        <Cred>
          <fieldset>
            <legend>About</legend>
            
                <Form layout="vertical" initialValues={{ ...values?.college }}>
                <About>
                    <Form.Item
                    label={<span className="form-label">Name</span>}
                    name="name"
                    required
                    rules={{ required: true }}
                    >
                    <Input  type="text" name="name" disabled placeholder={values?.college?.name} style={{fontSize:'0.8rem'}} />
                    <br />
                    </Form.Item>

                    <Form.Item
                    label={<span className="form-label">Email</span>}
                    name="email"
                    required
                    rules={{ required: true }}
                    >
                    <Input type="email" name="email" placeholder={values?.college?.email} disabled style={{fontSize:'0.8rem'}}/>
                    <br />
                    </Form.Item>

                    <Form.Item
                    label={<span className="form-label">Location</span>}
                    name="location"
                    required
                    rules={{ required: true }}
                    >
                    <Input type="text" name="location" placeholder={values?.college?.location} disabled style={{fontSize:'0.8rem'}} />
                    <br />
                    </Form.Item>
                    <Form.Item
                    label={<span className="form-label">District</span>}
                    name="district"
                    required
                    rules={{ required: true }}
                    >
                    <Input type="text" name="district" placeholder={values?.college?.district} disabled style={{fontSize:'0.8rem'}}/>
                    <br />
                    </Form.Item>
                    <Form.Item
                    label={<span className="form-label">State</span>}
                    name="state"
                    required
                    rules={{ required: true }}
                    >
                    <Input type="text" name="state" placeholder={values?.college?.state} disabled style={{fontSize:'0.8rem'}} />
                    <br />
                    </Form.Item>
                    <Form.Item
                    label={<span className="form-label">Country</span>}
                    name="country"
                    required
                    rules={{ required: true }}
                    >
                    <Input type="text" name="country" placeholder={values?.college?.country} disabled style={{fontSize:'0.8rem'}} />
                    <br />
                    </Form.Item>

                    <Form.Item label={<span className="form-label">Phone</span>} name="phone">
                    <Input
                        type="number"
                        name="phone"
                        disabled
                        placeholder={values?.college?.phone}
                        style={{fontSize:'0.8rem'}}
                    />
                    <br />
                    </Form.Item>
                </About>
                </Form>
          </fieldset>
         
        </Cred>

        <Verify>
          <div>
            <p>Verified</p>
            <p>{values?.verified ? <span>True</span> : <span>False</span>}</p>
            {values.verified? <button onClick={handleVerify}><span>False</span></button> : <button onClick={handleVerify}><span>True</span></button>}
          </div>
          <div>
            <p>Premium</p>
            <p>{values?.premium? <span>True</span>:<span>False</span>}</p>
            {values.premium? <button onClick={handlePremium}><span>False</span></button> : <button onClick={handlePremium}><span>True</span></button>}
          </div>
          <div >
            <p>Premium Purchased on</p>
            <p>{premiumBuy.getFullYear()}-{premiumBuy.getMonth()+1}-{premiumBuy.getDate()}</p>
          </div>
          <div >
            <p>Premium Expires on</p>
            <p>{expired.getFullYear()}-{expired.getMonth()+1}-{expired.getDate()}</p>
          </div>

        </Verify>

        <Transact>
        <div className="dropdown">
          <button className="dropbtn" onClick={() => setIsOpen(!isOpen)}>
            Recent  Transactions
          </button>
          {isOpen && (
            <div className="dropdown-content">
              {history.slice().reverse().map((transaction,index) => (
                <div className='partition' key={index}>
                <a ><span>Premium Purchased :</span> <span>{transaction.premiumBuy}</span></a>
                <a ><span>Premium Expires :</span> <span>{transaction.expired}</span></a>
                </div>
              ))}
            </div>
          )}
        </div>
        </Transact>
      </Layout>
    </Container>
  );
};



const Container=styled.div`
    grid-area:main;
`;
const Layout=styled.div`
   
 background-color: #ffff;
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    height:100%;
    border-radius: 5px;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
            flex-direction: column;
    -webkit-box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
            box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);

`;

const Links=styled.div`

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

    font-size:16px;
    line-height: 1.5;
    color:rgba(0,0,0,0,9);
    font-weight:600;
`;



const UserInfo=styled.div`
    border-bottom:1px solid rgba(0,0,0,0.15);
    padding:12px 12px 16px;
    word-wrap: break-word;
    word-break:break-word;
    width:100%;

`;

const CardBackground=styled.div`
    background:url("/images/card-bg.svg");
    background-position: center;
    background-size:462px;
    height:54px;
    max-width:100%;
    margin:-12px -12px 0;
`;

const Photo=styled.div`

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
-webkit-box-orient: vertical;
-webkit-box-direction: normal;
-ms-flex-direction: column;
        flex-direction: column;
img{
    -webkit-box-shadow:none;
            box-shadow:none;
    /* background-image: url("/images/photo.svg"); */
    width:72px;
    height:72px;
    -webkit-box-sizing:border-box;
            box-sizing:border-box;
    background-clip: content-box;
    background-color: white;
    background-position: center;
    background-size: 60%;
    background-repeat: no-repeat;
    border:2px solid white;
    margin:-38px auto 12px;
    border-radius:50%;
}
`;



const AddPhotoText=styled.div`

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

    color:#0a66c2;
    margin-top:4px;
    font-size:12px;
    line-height:1.33;
    font-weight:400;
`;

const Cred=styled.div`
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -webkit-box-align: start;
    -ms-flex-align: start;
            align-items: flex-start;
    -webkit-box-orient:vertical;
    -webkit-box-direction:normal;
    -ms-flex-direction:column;
            flex-direction:column;
    padding-left:20px;
    padding-top: 20px;
    padding-bottom:20px;
    -webkit-box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
            box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
    
    fieldset{
        border:0;
        border-radius:5px;
        -webkit-box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
                box-shadow: 0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgba(0 0 0/20%), 0 0 0  ,0 0 0 rgba(0 0 0/15%);
        width:90%;

    }
    legend{
        font-weight:600;
    }
    

`;

const About=styled.form`
    
   
 textarea,input{
        height:40px;
        margin:10px;
        width:80%;
        border-top:0;
        border-left: 0;
        border-right: 0;
    }
    input::-webkit-input-placeholder{
        color:black;
        font-size: 1rem;
    }
    input::-moz-placeholder{
        color:black;
        font-size: 1rem;
    }
    input:-ms-input-placeholder{
        color:black;
        font-size: 1rem;
    }
    input::-ms-input-placeholder{
        color:black;
        font-size: 1rem;
    }
    input::placeholder{
        color:black;
        font-size: 1rem;
    }

`;


const Verify=styled.div`
 
 display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
          flex-direction: column;
  div{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
        justify-content: space-around;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    button{
    cursor:pointer;
        width:80px;
        height:20px;
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

    p{
      font-size:0.8rem ;
    }
   
  }
`;

const Transact=styled.div`

  width: 100%;

.dropdown {
  position: relative;
  width: 100%;
  display: inline-block;
}

.dropbtn {
  background-color: #3498db;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  width: 100%;
  border-radius: 5px;
}

.dropbtn:hover {
  background-color: #2980b9;
}

.dropdown-content{
  max-height: 600px;
  overflow-y: scroll;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  span{
    font-size: 0.7rem;
  }
  .partition{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
        justify-content: space-around;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    padding-top: 4px;
    padding-bottom: 4px;
    /* border: 1px ; */
    -webkit-box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  }
  @media (max-width:768px) {
    max-height: 400px;
    overflow-y: scroll;
  }
}
`;

export default PendingPro;
