import { createRef, useEffect, useMemo, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Replay10Icon from "@mui/icons-material/Replay10";
import Forward30Icon from "@mui/icons-material/Forward30";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styled from "@mui/material/styles/styled";
import moment from "moment";

const SpeedButtons = styled(Button)`
  border-width: 3px;
  height: 40px;
  width: 40px;
  border-radius: 10px;
  margin-left: 10px;

  &:hover {
    border-width: 3px;
  }
`;

const VolumeBox = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 40px;
  margin-left: 16px;

  .volumeSlider{
    visibility: hidden;
  }

  &:hover{
    .volumeSlider{
      visibility: visible;
    }
  }
`;

const audioUrl =
  "https://content.blubrry.com/takeituneasy/lex_ai_balaji_srinivasan.mp3";

const Main = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState<number | number[]>(100);
  const [totalTime, setTotalTime] = useState(0);
  const [playedTime, setPlayedTime] = useState(0);
  const [sliderValue, setSliderValue] = useState<number | number[]>(0);

  const playerRef = createRef<AudioPlayer>();

  const getAudioDuration = () => {
    let audio = document.createElement("audio");
    audio.src = audioUrl;

    audio.addEventListener("loadedmetadata", function () {
      let seconds = audio.duration;
      setTotalTime(seconds);
    });
  };

  useEffect(() => {
    getAudioDuration();
  }, []);

  const onTogglePlay = () => {
    if (isPlaying) {
      playerRef?.current?.audio?.current?.pause();
    } else {
      playerRef?.current?.audio?.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onChange = (val: any) => {
    const sliderNewValue = (val?.target?.currentTime / totalTime) * 100;
    setSliderValue(Number(sliderNewValue.toFixed(5)));
    setPlayedTime(val?.target?.currentTime);
  };

  const currentTime = useMemo(
    () => new Date(playedTime * 1000).toISOString().slice(11, 19),
    [playedTime]
  );

  const onSliderChange = (event: Event, newValue: number | number[]) => {
    console.log('88 ===>', newValue)
    setSliderValue(newValue);
    if (playerRef?.current?.audio?.current) {
      playerRef.current.audio.current.currentTime = newValue as number * totalTime / 100;
    }
  };

  const onBackwardAudio = () => {
    if (playerRef?.current?.audio?.current) {
      playerRef.current.audio.current.currentTime = playerRef.current.audio.current.currentTime - 10;
    }
  }

  const onForwardAudio = () => {
    if (playerRef?.current?.audio?.current) {
      playerRef.current.audio.current.currentTime = playerRef.current.audio.current.currentTime + 30;
    }
  }

  const onVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue);
    if (playerRef?.current?.audio?.current) {
      playerRef.current.audio.current.volume = newValue as number / 100;
    }
  };

  const changePlaybackSpeed = (type: string) => {
    if (playerRef?.current?.audio?.current) {
      playerRef.current.audio.current.playbackRate = type == 'inc' ? playerRef.current.audio.current.playbackRate + 0.25 : playerRef.current.audio.current.playbackRate - 0.25;
      setPlaybackSpeed(type == 'inc' ? playbackSpeed + 0.25 : playbackSpeed - 0.25)
    }
  }

  const toggleMute = () => {
    if (playerRef?.current?.audio?.current) {
      playerRef.current.audio.current.muted = !isMuted;
    }
    setIsMuted(!isMuted)
  }

  return (
    <Container sx={{ height: "100%" }}>
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box width="100%" display="flex" alignItems='center'>
          <Button onClick={onTogglePlay}>
            {isPlaying ? (
              <PauseCircleIcon sx={{ fontSize: 70 }} />
            ) : (
              <PlayCircleIcon sx={{ fontSize: 70 }} />
            )}
          </Button>

          <Box ml={2} width={"max-content"}>
            <Slider step={Math.floor(totalTime) / 100000} value={sliderValue} onChange={onSliderChange} />
            <Box display="flex" alignItems="center" mt={1}>
              <Typography mr={1} color="secondary" fontSize={24}>
                {playbackSpeed}x
              </Typography>
              <SpeedButtons color="secondary" variant="outlined" onClick={() => changePlaybackSpeed('dec')}>
                <RemoveIcon color="inherit" />
              </SpeedButtons>
              <SpeedButtons color="secondary" variant="outlined" onClick={() => changePlaybackSpeed('inc')}>
                <AddIcon color="inherit" />
              </SpeedButtons>
              <Replay10Icon
                onClick={onBackwardAudio}
                color="secondary"
                sx={{ fontSize: "40px", ml: 2 }}
              />
              <Forward30Icon
                onClick={onForwardAudio}
                color="secondary"
                sx={{ fontSize: "40px", ml: 1 }}
              />
              <VolumeBox>
                {isMuted ? (
                  <VolumeOffIcon
                    onClick={toggleMute}
                    fontSize="inherit"
                  />
                ) : (
                  <VolumeUpIcon
                    onClick={toggleMute}
                    fontSize="inherit"
                  />
                )}
                <Box className="volumeSlider" display="flex" alignItems="center">
                  <Slider
                    sx={{ width: "150px", ml: 1 }}
                    value={volume}
                    disabled={isMuted}
                    onChange={onVolumeChange}
                  />
                </Box>
              </VolumeBox>
              <Typography
                color="secondary"
                letterSpacing={1}
                ml={"auto"}
                fontSize={20}
              >
                {totalTime
                  ? `${currentTime}/${moment
                    .utc(totalTime * 1000)
                    .format("hh:mm:ss")}`
                  : "--:-- / --:--:--"}
              </Typography>
            </Box>
          </Box>
        </Box>
        <AudioPlayer
          style={{ display: "none" }}
          ref={playerRef}
          volume={volume as number / 100}
          onListen={onChange}
          muted={isMuted}
          src="https://content.blubrry.com/takeituneasy/lex_ai_balaji_srinivasan.mp3"
        />
      </Box>
    </Container>
  );
};

export default Main;
