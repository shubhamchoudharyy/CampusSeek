import React from 'react'
import styled from 'styled-components'

const CollegeSearch = (props) => {
  return (
    <Container>
      <Layout>
      <UserInfo>
          <CardBackground/>
              <a>
                  <Photo/>
                  <Link>Guru Nanak Dev Engineering College</Link>
              </a>
              <a>
                  <AddPhotoText>Ludhiana,Punjab,India</AddPhotoText>
              </a>
             
      </UserInfo>
        <Description>
            <span>Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                 Asperiores illo alias sed nostrum, placeat mollitia. Dicta quam totam nostrum in quia eaque sequi, voluptatem laudantium unde? Nostrum veritatis deleniti error! Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, facilis?</span>
        </Description>

        <Button>
            <button><span><img src='/images/plus-icon.svg'/>Follow</span></button>
            <button className='web'><span>Visit Website</span></button>
        </Button>
        <Nav>
            <NavListWrap>
                <NavList className="active">
                        <a>

                            <span>Posts</span>
                        </a>
                    </NavList>
                    <NavList >
                        <a>
                            
                            <span>About</span>
                        </a>
                    </NavList>
                    <NavList >
                        <a>
                            
                            <span>Courses</span>
                        </a>
                    </NavList>
            </NavListWrap>
        </Nav>
      </Layout>
    </Container>
  )
}
const Container=styled.div`
    padding-top:52px;
    max-width:100%;
    height:100%;

`;

const Content=styled.div`
    max-width: 1128px;
    margin-left:auto;
    margin-right: auto;
`;
const Layout=styled.div`
    display: flex;
    
    border-radius: 5px;
    height:400px;
    flex-direction: column;
    
    margin:0 20% 0 25%;

    @media (max-width:600px){
    margin:0 8px 0 8px;
    border-radius: 5px;
    height:400px;
    flex-direction: column;
    }
`;



const UserInfo=styled.div`
    border-bottom:1px solid rgba(0,0,0,0.15);
    padding:12px 12px 16px;
    word-wrap: break-word;
    word-break:break-word;

`;

const CardBackground=styled.div`
    background:url("/images/card-bg.svg");
    background-position: center;
    background-size:462px;
    height:54px;
    margin:-12px -12px 0;
`;

const Photo=styled.div`
    box-shadow:none;
    background-image: url("/images/photo.svg");
    width:72px;
    height:72px;
    box-sizing:border-box;
    background-clip: content-box;
    background-color: white;
    background-position: center;
    background-size: 60%;
    background-repeat: no-repeat;
    border:2px solid white;
    margin:-38px auto 12px;
    border-radius:50%;
`;

const Link=styled.div`
    font-size:16px;
    line-height: 1.5;
    color:rgba(0,0,0,0,9);
    font-weight:600;

`;

const AddPhotoText=styled.div`
    color:#0a66c2;
    margin-top:4px;
    font-size:12px;
    line-height:1.33;
    font-weight:400;
`;

const Head=styled.div`
    background-color: beige;
    height: 30%;
    width:100%;
    display: flex;
    align-items: flex-start;
    img{
        height:40%;
        margin-left: 5%;
        margin-top: 10%;

    }
    

    @media (max-width:768px){
    height:20%;
    background-color: beige;
    width:100%;
    display: flex;
    align-items: flex-start;
    img{
        height:60%;
        margin-left: 5%;
        margin-top:8%;
    }
}

`;

const Cont=styled.div`
padding-top:10px ;
    display: flex;
    margin:20px;
    align-items: flex-start;
    span{

        color:rgba(0,0,0,0.9);
        font-weight: 1200;
        font-size: 1.3rem;
    }
    @media (max-width:768px){
    padding-top:10px ;
    display: flex;
    margin:20px;
    align-items: flex-start;
    span{

        color:rgba(0,0,0,0.9);
        font-weight: 1200;
        font-size: 1.3rem;
    }
}
`;
const Description=styled.div`
    color:black;
    margin:2%;
    width: 70%;
     @media (max-width:768px){
    padding-top: 10px;
    color: black;
     }
`;

const Button=styled.div`
    position: relative;
    display:flex;
    margin-top:10%;
    margin-left: 10px;
    
    button{
        width:120px;
        border-radius: 50px;
        background-color: #0A66C2;
        height: 40px;
        margin: 5px;
        border: 0;
        span{
            align-items: center;
            display: flex;
            justify-content: center;
            font-weight:600;
            color:rgba(0,0,0,0.7);
        }
    }
    .web{
        background-color: #fff;
        border: 1px solid;
    }
`;

const Nav=styled.div`
    /* margin-left:auto; */
    display: block;
    width: 100%;
    
    @media (max-width:768px){
        position: relative;
        left:0;
        
        background: white;
        width:100%;
        z-index:1;
        
    }
`;

const NavListWrap=styled.ul`
    display:flex;
    flex-wrap:nowrap;
    list-style-type:none;
    justify-content: space-around;

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

        span{
            color: rgba(0,0,0,0.5);
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
export default CollegeSearch
