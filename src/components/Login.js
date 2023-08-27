import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from '../firebase';
import { signInAPI } from '../actions';
import { connect } from 'react-redux';
import styled from 'styled-components'

const Login = (props) => {
    const auth = getAuth();
    
    const [data, setData] = useState({});

    const handleChange = (e) => {
        let input = { [e.target.name]: e.target.value };
        setData({ ...data, ...input });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    };

   

    return (
        <Container>
            <Form>
                <h1>Welcome to Campus Seek</h1>
                <Head>
                    <p>Login to Get Started</p>
                </Head>
                <Cred>
                    <input type="email" name="email" placeholder='Email Address' onChange={(e) => handleChange(e)} />
                    <input type="password" name="password" placeholder='Password' onChange={(e) => handleChange(e)} />
                    <button onClick={handleSubmit}><span>Login</span></button>
                    <p>Don't have an account? <a href="">Sign Up</a></p>
                    <hr />
                    <p>Register as a College/University ?<a href="">Click here</a></p>
                </Cred>
                <Horizontal>
                    <hr />
                    <span>or</span>
                    <hr />
                </Horizontal>
                <Button>
                <button className='btn' onClick={(e)=>{e.preventDefault()
                     props.signIn()}}>
                    <img src="/images/google.svg" alt="Google Logo" />
                    <span>Sign In With Google</span>
                </button>
                </Button>
            </Form>
        </Container>
    );
};


const Container=styled.div`
     width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: wrap;
`;
const Form=styled.form`

`;

const Head=styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    p{
        font-weight: 400;
        font-size: 1.2rem;
    }

`;

const Cred=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: wrap;
    input{
        width: 300px;
        height: 52px;
        margin: 8px;
    }

    button{
        width: 300px;
        height: 45px;
        background-color: #0A66C2;
        color: #fff;
        margin: 8px;
        border: 0px;
        border-radius: 3px;
        cursor: pointer;
        }
    button:hover{
        background-color: #0A55B3;
    }
    button span{
        font-size: 1rem;
        font-weight: 600;
    }
`;

const Horizontal=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;

    hr{
        width: 40%;
        display: inline;
        height: 0;
    }
    span{
        margin:2px ;
    }
`;

const Button=styled.div`
    button{
        width: 300px;
        height: 45px;
        background:transparent;
        color: black;
        margin: 8px;
        cursor: pointer;
        display: flex;
        border: 1px solid black;
        justify-content: space-around;
        margin-top: 40px;
        margin-left: 50px;
    }
    button:hover{
        background-color: rgba(0,0,0,0.07);
    }
    button span{
        font-size: 1rem;
        padding-top:10px;
    }
    button img{
        height: 30px;
        padding-top:5px ;
    }
`;
const mapStateToProps=(state)=>{
    return{
        user:state.userState.user,
    }
}

const mapDispatchToProps=(dispatch)=>{
    return{
        signIn:()=> dispatch(signInAPI()),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);
