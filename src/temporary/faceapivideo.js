import { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';

const FaceApiVideo = () => {
    const videoHeight = 400;
    const videoWidth = 640;
    const [initializing, setInitializing] = useState(false);
    const videoRef = useRef(); //SRC DO VIDEO
    const canvasRef = useRef();

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';
            setInitializing(true);
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
            ]).then(startVideo);
        };

        loadModels();
    }, []);

    const startVideo = () => {
        navigator.getUserMedia(
            {
                video: {}
            },
            (stream) => (videoRef.current.srcObject = stream),
            (err) => console.error(err)
        );
    };

    const handleVideoOnPlay = () => {
        setInterval(async () => {
            //A CADA INTERVALO, CALCULA OS DADOS DA API
            if (initializing) {
                setInitializing(false);
            }

            canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
            const displaySize = { width: videoWidth, height: videoHeight };
            faceapi.matchDimensions(canvasRef.current, displaySize);

            const detections = await faceapi //DETECTIONS É OS DADOS DA API
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
            console.log(detections);
        }, 100); //INTERVALO DETERMINADO
    };

    return (
        <div>
            <span>{initializing ? 'Initializing' : 'Ready'}</span>
            <video
                ref={videoRef}
                autoPlay
                muted
                height={videoHeight}
                width={videoWidth}
                onPlay={handleVideoOnPlay}
            />
            <canvas ref={canvasRef} />
        </div>
    );
};

export default FaceApiVideo;
