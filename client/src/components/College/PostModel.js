import React, { useState } from 'react'
import { Timestamp } from 'firebase/firestore';
import { styled } from 'styled-components'
import ReactPlayer from 'react-player';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Spin, message } from 'antd';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
// import { postArticleAPI } from '../actions';
// import {firestore} from '../firebase'
const PostModel = (props) => {
    const [editorText, setEditorText] = useState('');
    const [shareImg, setShareImg] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [assetArea, setAssetArea] = useState('');
    const {user}=useSelector((state)=>state.user);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageSelected, setImageSelected] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newPhotoUrl, setNewPhotoUrl] = useState('');
    const [showUploadAndPostButton, setShowUploadAndPostButton] = useState(true);
    const [showCrossButton, setShowCrossButton] = useState(false);
    const [isCourseFormFilled, setIsCourseFormFilled] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoSelected, setVideoSelected] = useState(false);
    console.log(user);

    const handleFileUpload = async (file) => {
        try {
            if (selectedImage) {
              setUploading(true);
              const formData = new FormData();
              formData.append('fieldname', selectedImage);
      
              const res = await axios.post(`${baseURL}/user/Url`, formData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'multipart/form-data',
                },
              });
      
              if (res.data.success) {
                setNewPhotoUrl(res.data.data);
                setUploading(false);
                setShowCrossButton(false);
                setSelectedImage(null);
                setImageSelected(false);
                setShowUploadAndPostButton(false);
                handleResetImage();
                
      
                // After successfully uploading the image, update the profile photo in the backend
                await updatePost(res.data.data);
              }
            }else if(selectedVideo){
              setUploading(true);
              const formData = new FormData();
              formData.append('fieldname', selectedVideo);
      
              const res = await axios.post(`${baseURL}/user/videoUrl`, formData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'multipart/form-data',
                },
              });
      
              if (res.data.success) {
                setNewPhotoUrl(res.data.data);
                setUploading(false);
                setShowCrossButton(false);
                setSelectedVideo(null);
                setVideoSelected(false);
                setShowUploadAndPostButton(false);
                handleResetImage();
                
      
                // After successfully uploading the image, update the profile photo in the backend
                await uploadVideoUrl(res.data.data);

            }
          }
          } catch (error) {
            console.error(error);
            setUploading(false);
          }
        };
    const updatePost=async(photoUrl,e)=>{
        try{
            const res=await axios.post(`${baseURL}/college/post`,
            {userId:user._id,image:photoUrl,description:editorText},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(res.data.success){
                message.success(res.data.message);
                reset(e);
            }
        } catch (error) {
            console.log(error);
          }
    }
    const uploadVideo=async(e)=>{
        try{
            setVideoLoading(true);
            const res=await axios.post(`${baseURL}/college/video`,
            {userId:user._id,description:editorText,video:videoLink},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(res.data.success){
                message.success(res.data.message);
                reset(e);
            }
        }catch (error) {
            message.error('Something went wrong');
          }finally{
            setVideoLoading(false);
          }
    }

    const uploadVideoUrl=async(videoUrl,e)=>{
        try{
            setVideoLoading(true);
            const res=await axios.post(`${baseURL}/college/video`,
            {userId:user._id,description:editorText,video:videoUrl},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(res.data.success){
                message.success(res.data.message);
                reset(e);
            }
        }catch (error) {
            message.error('Something went wrong');
          }finally{
            setVideoLoading(false);
          }
    }

    const uploadDescription=async(e)=>{
        try{
            
            const res=await axios.post(`${baseURL}/college/description`,
            {userId:user._id,description:editorText},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(res.data.success){
                message.success(res.data.message);
                reset(e);
            }
        }catch (error) {
            message.error('Something went wrong');
          }finally{
            
          }
    }
    const baseURL = "http://localhost:5000/api/v1";
    const switchAssetArea = (area) => {
        setShareImg('');
        setVideoLink('');
        setAssetArea(area);
    }
    const handleChange = (e) => {
        const image = e.target.files[0];
        if (image === '' || image === undefined) {
          alert(`Not an image, the file is a ${typeof image}`);
          return;
        }
        setSelectedImage(image);
        setImageSelected(true);
        setShowUploadAndPostButton(true);
        setShowCrossButton(true);
      };

    const handleVideoChange = (e) => {
        const video = e.target.files[0];
        if (video === '' || video === undefined) {
          alert(`Not an video, the file is a ${typeof video}`);
          return;
        }
        setSelectedVideo(video);
        setVideoSelected(true);
        setShowUploadAndPostButton(true);
        setShowCrossButton(true);
      };


      const handleResetImage = () => {
        setSelectedImage(null);
        setImageSelected(false);
        setShowUploadAndPostButton(true);
        setShowCrossButton(false);
      };
    
    
    const reset = (e) => {
        setEditorText('');
        setShareImg('');
        setVideoLink('');
        setAssetArea('');
        
        props.handleClick(e);
    }
    const handleClose=(e)=>{
        props.handleClick(e);
    }
    if(!user){
        return <Spin style={{marginTop:'12px'}}/>
    }
    return (
        <>
        {props.showModel === 'open' && (
          <Container>
             {uploading? (
                <Spin style={{ marginTop: '12px' }} />
              ) : (
            <Content>
              
                <Header>
                  <h2>Create a Post</h2>
                  <button onClick={(e) => reset(e)}>
                    <img src="https://th.bing.com/th/id/R.71db1d1c3745dab1002c547db0b6b69f?rik=XkC6sVfP2ZTCOg&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_391885.png&ehk=vf0OAda93WujxQv91wKrXxIN0w0eejVocrMDMOI4%2bXE%3d&risl=&pid=ImgRaw&r=0" alt="" />
                  </button>
                </Header>
              
              <SharedContent>
                <UserInfo>
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt="User" />
                  ) : (
                    <img src="/images/user.svg" alt="" />
                  )}
                  <span>{user.name}</span>
                </UserInfo>
                <Editor>
                  <textarea
                    value={editorText}
                    placeholder="What do you want to talk about?"
                    autoFocus={true}
                    onChange={(e) => setEditorText(e.target.value)}
                  />
                  {assetArea === 'image' ? (
                    <UploadImg>
                      <input
                        type="file"
                        accept="/image/gif,image/jpeg, /image/png"
                        name="image"
                        id="file"
                        style={{ display: 'none' }}
                        onChange={handleChange}
                      />
                      <p>
                        <label htmlFor="file">Select a Image</label>
                      </p>
                      {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Selected" />}
                    </UploadImg>
                  ) : assetArea === 'media'? (
                    <>
                      <input
                        type="text"
                        placeholder="Please input a video Link"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                      />
                      {videoLink && <ReactPlayer width="100%" url={videoLink} />}
                    </>
                  ) : assetArea === 'video' && (
                    <UploadImg>
                      <input
                        type="file"
                        accept="video/*"
                        name="video"
                        id="file"
                        style={{ display: 'none' }}
                        onChange={handleVideoChange}
                      />
                      <p>
                        <label htmlFor="file">Select a video</label>
                      </p>
                      {selectedVideo && <ReactPlayer width="100%" url={URL.createObjectURL(selectedVideo)} controls/>}
                    </UploadImg>
                  ) }
                </Editor>
              </SharedContent>
              <SharedCreation>
                <AttachAssets>
                  <AssetButton onClick={() => switchAssetArea('image')}>

                    <img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png" alt="Photo" />
                  </AssetButton>
                 
                  <AssetButton onClick={() => switchAssetArea('video')}>

                    <img src="https://e7.pngegg.com/pngimages/103/322/png-clipart-black-video-logo-video-icon-video-icon-angle-white-thumbnail.png" alt="Video" />
                  </AssetButton>
                  <AssetButton onClick={() => switchAssetArea('media')}>

                    <img src="https://static.thenounproject.com/png/770619-200.png" alt="Video" />
                  </AssetButton>
                </AttachAssets>
                <ShareComment>
                  {/* <AssetButton>
                    <img src="/images/share-comment.svg" alt="Comment" />
                  </AssetButton> */}
                </ShareComment>
                <PostButton
                  onClick={(e) => {
                    if (videoLink) {
                      uploadVideo();
                    } else if(selectedImage || selectedVideo) {
                      handleFileUpload();
                    }else{
                        uploadDescription();
                    }
                    // Call handleClose after uploading or posting
                  }}
                  disabled={!editorText || (videoLink && videoLoading)}
                >
                  {videoLoading ? <Spin /> : 'Post'}
                </PostButton>
              </SharedCreation>
              
            </Content>
            )} 
          </Container>
        )}
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
        img{
            pointer-events: none;
            height: 28px;
            width: 28px;
            align-items: center;

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
    img{
      height: 30px;
      width: 30px;
    }
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
