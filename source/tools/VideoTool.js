const VideoTool = {
    __videoElement: document.createElement("video"),

    getVideoLength(videoFile) {
        return new Promise((resolve, reject) => {
            VideoTool.__videoElement.onloadedmetadata = e => {
                resolve(VideoTool.__videoElement.duration);
            };
            VideoTool.__videoElement.onerror = e => {
                reject(`Can not load video meta of file "${videoFile}"`);
            };
            VideoTool.__videoElement.src = videoFile;
        });
    }
};

export default VideoTool;