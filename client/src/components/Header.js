import React,{useEffect, useState} from 'react'
import styled from 'styled-components'
import {connect, useSelector} from 'react-redux';
// import { signOutAPI } from '../actions';
import { getAuth, signOut } from "firebase/auth";
import {app} from '../firebase';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Searches from './Searches';
const Header = () => {
    const [activeNav, setActiveNav] = useState('Home');
    const [search,setSearch]=useState('');
    const {user}=useSelector((state)=>state.user)
    const auth=getAuth();
    const isAdmin=user? user.isAdmin:false;
    const isCollege=user? user.isCollege:false;
    const location=useLocation();
//   console.log(user.isAdmin);
console.log(isAdmin)
const navigate=useNavigate();

useEffect(() => {
    if (!localStorage.getItem('token') ) {
      // Redirect to the login page if there's no token or user data
      navigate('/login');
    }
  }, [user, navigate]);
    const handleClick=async()=>{
        localStorage.clear();
        navigate("/login");
    }
    const handleSearch=()=>{
        setSearch('');
    }

    const handleNavClick = (navName) => {
        setActiveNav(navName);
      };
    const isNavActive = (navPath) => {
        return location.pathname === navPath ? 'active' : '';
      };
  return (
    <Container>
        <Content>
            <Logo>
                <a onClick={()=>navigate('/')} style={{cursor:'pointer'}}>
                    <img src="/images/logo.png" alt="" />
                </a>
            </Logo>
            <Search>
                <div>
                    <input type="text" placeholder='Search' value={search} 
                    onChange={(e)=>setSearch(e.target.value)} name="" id="" />
                </div>
                <SearchIcon>
                    
                    <img src="/images/search-icon.svg" alt="" />
                </SearchIcon>
            </Search>
            <Nav>
                <NavListWrap>
                <NavList
          className={isNavActive('/')} // Check if the current URL is '/'
          onClick={() => handleNavClick('Home')}
        >
          <Link to="/">
            <img src="/images/nav-home.svg" alt="" />
            <span>Home</span>
          </Link>
        </NavList>
        {isAdmin ? (
          <NavList
            className={isNavActive('/college-requests')} // Check if the current URL is '/college-requests'
            onClick={() => handleNavClick('Colleges Requests')}
          >
            <Link to="/college-requests">
              <img src="/images/nav-network.svg" alt="" />
              <span>Colleges Requests</span>
            </Link>
          </NavList>
        ) : (
          <NavList
            className={isNavActive(`/mycollege/${user?._id}`)} // Check if the current URL is '/mycollege'
            onClick={() => handleNavClick('My Colleges')}
          >
            <a onClick={() => navigate(`/mycollege/${user?._id}`)}>
              <img src="/images/nav-network.svg" alt="" />
              <span>My Colleges</span>
            </a>
          </NavList>
        )}

        {isAdmin?
        <NavList
          className={isNavActive(`/college-list/${user._id}`)} // Check if the current URL is '/colleges'
          onClick={() => handleNavClick('Colleges')}
        >
          <a onClick={()=>navigate(`/college-list/${user._id}`)}>
            <img src="/images/nav-jobs.svg" alt="" />
            <span>Colleges</span>
          </a>
        </NavList>:
        <NavList
        className={isNavActive(`/colleges/${user?._id}`)} // Check if the current URL is '/colleges'
        onClick={() => handleNavClick('Colleges')}
      >
        <a onClick={() => navigate(`/colleges/${user?._id}`)}>
          <img src="/images/nav-jobs.svg" alt="" />
          <span>Colleges</span>
        </a>
      </NavList>
    }
                    {/* <NavList >
                        <a>
                            <img src="/images/nav-messaging.svg" alt=""  />
                            <span>Messages</span>
                        </a>
                    </NavList> */}
                    <NavList
                     className={isNavActive('/notification')} // Check if the current URL is '/colleges'
                     onClick={() => handleNavClick('Notification')}
                    >
                        <a onClick={()=>navigate('/notification')}>
                            <img src="/images/nav-notifications.svg" alt=""  />
                            <span>Notification</span>
                        </a>
                    </NavList>

                    <User>
                        <a>
                            
                            <img src={user?.photoUrl} alt="" />
                            <span>Me
                            <img src="/images/down-icon.svg" alt="" />
                            </span>
                        </a>
                        
                        <Profile >
                        {isCollege ? (
                            <a onClick={() => navigate(`/profile-clg/${user?._id}`)}>My Profile</a>
                            ) : isAdmin ? (
                            <a onClick={() => navigate(`/profile-admin/${user?._id}`)}>My Profile</a>
                            ) : (
                            <a onClick={() => navigate(`/profile-user/${user?._id}`)}>My Profile</a>
                            )}

                    </Profile>
                        
                        <SignOut onClick={handleClick}>
                            <a>Sign Out</a>
                        </SignOut>
                    </User>
                    {/* <Work>
                        <a>
                            <img src="/images/nav-work.svg" alt="" />
                            <span>Work
                                <img src="/images/down-icon.svg" alt="" />
                            </span>
                        </a>
                    </Work> */}
                   
                </NavListWrap>
            </Nav>
            </Content>
            <Searches search={search}/>
      
    </Container>
  )
}

const Container=styled.div`
    background-color: white;
    border-bottom:1px solid rgba(0,0,0,0.08);
    left:0;
    padding:0 24px;
    top:0;
    width:100vw;
    z-index:100;
    position: fixed;
`;

const Content=styled.div`
    display:flex;
    align-items:center;
    margin:0 auto;
    min-height:100%;
    max-width: 1128px;
`;

const Logo=styled.div`
margin-right:8px;
font-size: 8px;
cursor: pointer;
img{
    height:40px;
    cursor: pointer;
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

const Nav=styled.div`
    margin-left:auto;
    display: block;
    
    @media (max-width:768px){
        position: fixed;
        left:0;
        bottom:0;
        background: white;
        width:100%;
        z-index:1;
        
    }
`;

const NavListWrap=styled.ul`
    display:flex;
    flex-wrap:nowrap;
    list-style-type:none;

    .active{
        span:after{
            content:"";
            transform: scaleX(1);
            border-bottom: 2px solid var(--white,#fff);
            bottom:0;
            left:0;
            position:absolute;
            transition:transform 0.2s ease-in-out;
            width:100%;
            border-color: rgba(0,0,0,0.9);


        }
    }
`;

const NavList=styled.li`
    display:flex;
    align-items:center;
    cursor: pointer;
    

    a{
        align-items:center;
        background:transparent;
        display:flex;
        flex-direction: column;
        font-size:12px;
        font-weight:400;
        justify-content:center;
        line-height:1.5;
        min-height:42px;
        min-width:88px;
        position:relative;
        text-decoration: none;
        cursor: pointer;

        span{
            color: rgba(0,0,0,0.5);
            /* color:white; */

            display: flex;
            align-items:center;
            justify-content:space-around;
        }

        @media (max-width:768px){
            min-width:120px;
            
        }
        
        }
        &:hover,
        &:active{
            a{
                span{
                    color:rgba(0,0,0,0.9)
                }
            }

    } 
`;

const Profile=styled.div`
    position:absolute;
    top:45px;
    background: white;
    border-radius: 0 0 5px 5px;
    width:100px;
    height:40px;
    font-size: 16px;
    transition-duration: 167ms;
    text-align: center;
    display: none;
    @media(max-width:768px){
        top:-20px;
    }

`;

const SignOut=styled.div`
    position:absolute;
    top:80px;
    background: white;
    border-radius: 0 0 5px 5px;
    width:100px;
    height:40px;
    font-size: 16px;
    transition-duration: 167ms;
    text-align: center;
    display: none;
    @media(max-width:768px){
        top:-50px;
    }
`;

const User=styled(NavList)`
    a>svg{
        width:24px;
        border-radius:20%
    }

    a>img{
        width:24px;
        height:24px;
        border-radius:50%;
    }

    span{
        display: flex;;
        align-items:center;
    }

    &:hover{
        ${Profile}{
            align-items:center;
            display:flex;
            justify-content: center;
        }
        ${SignOut}{
            align-items:center;
            display:flex;
            justify-content: center;
        }
    }
`;

const Work=styled(User)`
border-left:1px solid rgba(0,0,0,0.8);
`;

// const mapStateToProps=(state)=>{
//     return {
//         user:state.userState.user,
//     };
// }

// const mapDispatchToProps=(dispatch)=>{
//     return {
//         signOut:()=>dispatch(signOutAPI())
//     }
// }
// export default connect(mapStateToProps,mapDispatchToProps)(Header);

export default Header
