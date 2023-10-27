import React from 'react'
import styled from 'styled-components'
const Rightside = () => {
  return (
    <Container>
      <FollowCard>
        <Tittle>
            
            <h2>About Us</h2>
            {/* <img src='/images/insta.webp' alt="" /> */}
        </Tittle>
        <span>You can contact us through our social handles</span>
        <FeedList>
            <li>
                <a>
                    <Avatar/>
                </a>
                <div>
                    <span>#Instagram</span>
                    <button><a href='https://www.instagram.com/' target='_blank'>Follow</a> </button>
                </div>
            </li>
            <li>
                <a>
                    <Avatar2/>
                </a>
                <div>
                    <span>#Gmail</span>
                    <button> <a href="mailto:example@example.com">Message us</a></button>
                </div>
            </li>
        </FeedList>

        {/* <Recommendation>
            View all recommendations
            <img src="/images/right-icon.svg" alt="" />
        </Recommendation> */}
      </FollowCard>

      <BannerCard>
     
      </BannerCard>
    </Container>
  )
}

const Container=styled.div`
 grid-area: rightside;

`;

const FollowCard=styled.div`
   
 text-align:center;
    overflow:hidden;
    margin-bottom: 8px;
    background-color: #fff;
    border-radius: 5px;
    position:relative;
    border:none;
    -webkit-box-shadow:0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgb(0 0 0/20%);
            box-shadow:0 0 0 1px rgb(0 0 0/15%), 0 0 0 rgb(0 0 0/20%);
    padding:12px;

`;

const Tittle=styled.div`
    
display:-webkit-inline-box;
    display:-ms-inline-flexbox;
    display:inline-flex;
    -webkit-box-align:center;
    -ms-flex-align:center;
            align-items:center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
            justify-content: space-between;
    font-size:16px;
    width:100%;
    color:rgba(0,0,0,0.6);
    img{
        height:40px;
        width:40px;
    }
`;

const FeedList=styled.ul`
   
 margin-top:16px;
    li{
        display:-webkit-box;
        display:-ms-flexbox;
        display:flex;
        -webkit-box-align:center;
            -ms-flex-align:center;
                align-items:center;
        margin:12px 0;
        position:relative;
        font-size:14px;
        &>div{
            display:-webkit-box;
            display:-ms-flexbox;
            display:flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;

        }

        button{
            background-color: transparent;
            color:rgba(0,0,0,0.6);
            -webkit-box-shadow: inset 0 0 0 1px solid rgba(0,0,0,0.6);
                    box-shadow: inset 0 0 0 1px solid rgba(0,0,0,0.6);
            position:16px;
            -webkit-box-align:center;
                -ms-flex-align:center;
                    align-items:center;
            border-radius: 15px;
            -webkit-box-sizing: border-box;
                    box-sizing: border-box;
            font-weight: 600;
            display: -webkit-inline-box;
            display: -ms-inline-flexbox;
            display: inline-flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            max-height:32px;
            max-width:480px;
            text-align:center;
            cursor: pointer;
            outline:none;
            a{
                text-decoration: none;
            }

        }
    }
`;

const Avatar=styled.div`
    background-image: url('/images/insta.webp');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    width:48px;
    height: 48px;
    margin-right: 8px;
`;

const Avatar2=styled.div`
    background-image: url('/images/gmail.webp');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    width:48px;
    height: 48px;
    margin-right: 8px;
`;


const BannerCard = styled(FollowCard)`
  img {
    width: 100%;
    height: 100%;
  }
`;
export default Rightside;

