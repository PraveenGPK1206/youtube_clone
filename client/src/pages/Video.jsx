import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/Share";
import AddTaskOutlinedIcon from "@mui/icons-material/BookmarkBorder";
import Comments from '../components/Comments';

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { subscription } from "../redux/userSlice";
import Recommendation from '../components/Recommendation';
import { useNavigate } from "react-router-dom";
const Container=styled.div`

display:flex;
gap:24px;
color:${({ theme }) => theme.text};
`;

const Content=styled.div`
flex:5;

`;

const VideoWrapper=styled.div`

`;

const Title=styled.h1`
font-size:16px;
font-weight:500;
margin-bottom:10px;
margin-top:20px;
`;

const Details=styled.div`
font-size:12px;
display:flex;
align-items:center;
justify-content:space-between;
`;

const Info =styled.span`

`;

const Buttons=styled.div`
display:flex;
gap:20px;
margin-top:0;
`;

const Button=styled.div`
display:flex;
align-items:center;
gap:5px;
cursor:pointer;
`;

const Hr=styled.hr`
margin:15px 0px;
border:0.5px solid ${({ theme }) => theme.soft};
`;

const Channel=styled.div`
display:flex;
justify-content:space-between;
`;

const ChannelInfo=styled.div`
display:flex;
gap:20px;
`;

const Image=styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail=styled.div`
display:flex;
flex-direction:column;
`;

const ChannelName=styled.span`
 font-weight:500;
`;
const ChannelCounter=styled.span`
 margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;
const Description=styled.p`
font-size:14px;
`;
const Subscribe=styled.button`
background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;
const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const { currentUser} = useSelector((state) => state.user);
  const { currentVideo} = useSelector((state) => state.video)
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const path = useLocation().pathname.split("/")[2];

  
  const [channel,setChannel] = useState({});

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const videoRes = await axios.get(`/videos/find/${path}`);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );       
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      }catch(err){
          
      }
    }
    fetchData();
  },[path,dispatch]);

  const handleLike = async () => {
    await axios.put(`/users/like/${currentVideo._id}`);
    dispatch(like(currentUser._id));
    
  };
  const handleDislike = async () => {
    await axios.put(`/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
  };

  const handleSub = async () => {
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`/users/unsub/${channel._id}`)
      : await axios.put(`/users/sub/${channel._id}`);
    dispatch(subscription(channel._id));
  };

  return (
    <Container>
      <Content>
        <VideoWrapper>
        <VideoFrame src={currentVideo.videoUrl? currentVideo.videoUrl : navigate("/signin") } controls />
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>{currentVideo.views} views • {format(currentVideo.createdAt)} </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
            {currentVideo.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "} Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr/>
        <Channel>
          <ChannelInfo>
          <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>
              {currentVideo.desc}
              </Description>
            </ChannelDetail>
          </ChannelInfo>
            <Subscribe onClick={handleSub}>
              {currentUser.subscribedUsers?.includes(channel._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
              </Subscribe>
        </Channel>
        <Hr/>
        <Comments videoId={currentVideo._id}/>
      </Content>
      <Recommendation tags={currentVideo.tags}/>
    </Container>
    
  );
}

export default Video;