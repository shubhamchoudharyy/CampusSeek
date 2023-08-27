import React, { useState } from 'react'
import { Timestamp } from 'firebase/firestore';
import { styled } from 'styled-components'
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
// import { postArticleAPI } from '../actions';
// import {firestore} from '../firebase'
const PostModel = (props) => {
    const [editorText, setEditorText] = useState('');
    const [shareImg, setShareImg] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [assetArea, setAssetArea] = useState('');

    const handleChange = (e) => {
        const image = e.target.files[0];

        if (image === '' || image === undefined) {
            alert(`not an image,the file is a ${typeof image}`);
            return;
        }

        setShareImg(image);
    }

    const switchAssetArea = (area) => {
        setShareImg('');
        setVideoLink('');
        setAssetArea(area);
    }

    const postArticle = (e) => {
        e.preventDefault();
        if (e.target !== e.currentTarget) {
            return;
        }
        const payload = {
            image: shareImg,
            video: videoLink,
            user: props.user,
            description: editorText,
            timestamp: Timestamp.fromDate(new Date()),
        };
        console.log("Payload:", payload); // Log the payload to check its structure
        props.postArticle(payload);
        reset(e);
    }
    
    const reset = (e) => {
        setEditorText('');
        setShareImg('');
        setVideoLink('');
        setAssetArea('');
        props.handleClick(e);
    }
    return (
        <>
            {/* {props.showModel === 'open' && */}
                <Container>
                    <Content>
                        <Header>
                            <h2>Create a Post</h2>
                            <button onClick={(e) => reset(e)}><img src="/images/close-icon.svg" alt="" /></button>
                        </Header>
                        <SharedContent>
                            <UserInfo>
                                {/* {props.user.photoURL ? <img src={props.user.photoURL} /> :
                                    <img src="/images/user.svg" alt="" />
                                } */}
                                <img src="/images/user.svg" alt="" />
                                <span>Shubham</span>
                            </UserInfo>
                            <Editor>
                                <textarea value={editorText} placeholder='What do you want to talk about?' autoFocus={true} onChange={(e) => setEditorText(e.target.value)} />
                                {assetArea === 'image' ? (
                                    <UploadImg>
                                        <input type="file" except="/image/gif,image/jpeg, /image/png"
                                            name='image'
                                            id='file'
                                            style={{ display: 'none' }}
                                            onChange={handleChange}
                                        />
                                        <p><label htmlFor='file'>
                                            Select a Image
                                        </label></p>
                                        {shareImg && <img src={URL.createObjectURL(shareImg)} />}
                                    </UploadImg>)
                                    : assetArea === 'media' && (

                                        <>
                                            <input type="text" placeholder='Please input a video Link'
                                                value={videoLink}
                                                onChange={(e) => setVideoLink(e.target.value)} />
                                            {videoLink && (<ReactPlayer width={"100%"} url={videoLink} />)}


                                        </>
                                    )


                                }
                            </Editor>
                        </SharedContent>
                        <SharedCreation>
                            <AttachAssets>
                                <AssetButton onClick={() => switchAssetArea('image')}>
                                    photo
                                    <img src="/images/share-image.svg" alt="" />
                                </AssetButton>
                                <AssetButton onClick={() => switchAssetArea('media')}>
                                    video
                                    <img src="/images/share-video.svg" alt="" />
                                </AssetButton>

                            </AttachAssets>
                            <ShareComment>
                                <AssetButton>
                                    <img src="/images/share-comment.svg" alt="" />
                                </AssetButton>
                            </ShareComment>

                            <PostButton 
                            // onClick={(e) => postArticle(e)} 
                            disabled={!editorText ? true : false}>
                                Post
                            </PostButton>
                        </SharedCreation>
                    </Content>
                </Container>
            {/* } */}
        </>
    )
}
const Container = styled.div`
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:9999;
    color:black;
    background-color: rgba(0,0,0,0.8);
    animation: fadeIn 0.3s;

`;
const Content = styled.div`
    max-width: 100%;
    max-width: 520px;
    background-color: white;
    max-height:90%;
    overflow:initial;
    border-radius:5px;
    position: relative;
    display:flex;
    flex-direction: column;
    top:32px;
    margin: 0 auto;
`;

const Header = styled.div`
    display:block;
    padding:16px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    font-size: 16px;
    line-height:1.5;
    color:rgba(0,0,0,0.6);
    font-weight:400;
    display:flex;
    justify-content: space-between;
    align-items: center;
    button{
        height:40px;
        width:40px;
        min-width: auto;
        color:rgba(0,0,0,0,15);
        svg,img{
            pointer-events: none;
        }
    }
`;

const SharedContent = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y:auto;
    vertical-align: baseline;
    background: transparent;
    padding: 8px 12px;
`;

const UserInfo = styled.div`
    display:flex;
    align-items: center;
    padding:12px 24px;
    svg,img{
        width:48px;
        height:48px;
        background-clip: content-box;
        border: 2px solid transparent;
        border-radius:50%;
    }
    span{
        font-weight: 600;
        font-size:16px;
        line-height: 1.5;
        margin-left:5px;
    }

`;

const SharedCreation = styled.div`
    display:flex;
    justify-content: space-between;
    padding:12px 24px 12px 16px;
`;

const AssetButton = styled.div`
    display:flex;
    align-items:center;
    height:40px;
    min-width:auto;
    color:rgba(0,0,0,0.5);
`;



const AttachAssets = styled.div`

    align-items: center;
    display:flex;
    padding-right: 8px;

    ${AssetButton}{
        width:40px;
    }
`;

const ShareComment = styled.div`
    padding-left: 8px;
    margin-right:auto;
    border-left:1px solid rgba(0,0,0,0.35);
    ${AssetButton}{
        svg{
            margin-right: 5px;
        }
    }
`;

const PostButton = styled.div`
    min-width:40px;
    padding-top: 10px;
    border-radius:20px;
    padding-left: 16px;
    padding-right: 16px;
    background:${(props) => (props.disabled ? "rgba(0,0,0,0.8)" : "#0a66c2")};
    color:${(props) => (props.disabled ? "rgba(1,1,1,0.2)" : "white")};
    &:hover{
        background:${(props) => (props.disabled ? 'rgba(0,0,0,0.08)' : '#004182')};
    }
`;

const Editor = styled.div`
    padding:12px 24px;
    textarea{
        width:100%;
        min-height:100px;
        resize: none;

    }
    input{
        width:100%;
        height:35px;
        font-size:16px;
        margin-bottom: 20px;

    }
`;

const UploadImg = styled.div`
    text-align:center;
    img{
        width:100%;

    }
`;
// const mapStateToProps = (state) => {
//     return {
//         user: state.userState.user,
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         postArticle: (payload) => dispatch(postArticleAPI(payload))
//     }
// }


// export default connect(mapStateToProps, mapDispatchToProps)(PostModel)
export default PostModel;
