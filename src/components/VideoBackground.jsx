import React from 'react';
import styled from 'styled-components';

const VideoContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
  filter: brightness(0.8) contrast(1.3) saturate(1.5) blur(0px);
`;

const VideoBackground = () => {
  return (
    <VideoContainer>
      <Video autoPlay muted loop playsInline>
        <source src="https://motionbgs.com/media/3440/deep-nebula.960x540.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </Video>
    </VideoContainer>
  );
};

export default VideoBackground; 