// import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";

const appId = "5a677d60bfe0411d949b3d7bcf6cc354";
const token ="007eJxTYJi9bZpkit7Hqxd/lTXom2ZExmf0up7N3jX3sJ+u8qKw6tMKDKaJZubmKWYGSWmpBiaGhimWJpZJxinmSclpZsnJxqYmsyzOpDUEMjI8LL7BzMgAgSA+F0NeanlyRmJeXmoOAwMAYNkjQg=="
export const channelName = "newchannel";
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token
 };
// export const useClient = createClient(config);
export const client=AgoraRTC.createClient(config)


// export const useLocalCameraTrack=AgoraRTC.createCameraVideoTrack()
// export const useLocalMicrophoneTrack=AgoraRTC.createMicrophoneAudioTrack()
// export const useLocalCamera = AgoraRTC.useLocalCameraTrack;
// export const useLocalMicrophone = AgoraRTC.useLocalMicrophoneTrack;



