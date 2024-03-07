// import React, { useState, useRef, useCallback } from 'react';
// import ReactDOM from 'react-dom';
// import Webcam from 'react-webcam';
// import { useMediaRecorder } from './useMediaRecorder';

// const WebCam = () => {
//     const webcamRef = useRef(null);
//     const [recordedChunks, setRecordedChunks] = useState([]);
//     const { capturing, startRecording, stopRecording } = useMediaRecorder(webcamRef, setRecordedChunks);

//     const handleDownload = useCallback(() => {
//         if (recordedChunks.length) {
//             const blob = new Blob(recordedChunks, { type: "video/webm" });
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             document.body.appendChild(a);
//             a.style = 'display: none';
//             a.href = url;
//             a.download = 'react-webcam-stream-capture.webm';
//             a.click();
//             window.URL.revokeObjectURL(url);
//             document.body.removeChild(a);
//             setRecordedChunks([]);
//         }
//     }, [recordedChunks]);

//     return (
//         <div style={{ textAlign: 'center' }}>
//             <Webcam audio={false} ref={webcamRef} style={{ margin: '0 auto', display: 'block' }} />
//             <button
//                 onClick={capturing ? stopRecording : startRecording}
//                 aria-label={capturing ? 'Stop Capture' : 'Start Capture'}
//                 style={{ margin: '10px' }}
//             >
//                 {capturing ? 'Stop Capture' : 'Start Capture'}
//             </button>
//             {recordedChunks.length > 0 && (
//                 <button onClick={handleDownload} style={{ margin: '10px' }} aria-label="Download video">
//                     Download
//                 </button>
//             )}
//         </div>
//     );
// };


// export default WebCam;


import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Webcam from 'react-webcam';

const WebcamStreamCapture = () => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [duration, setDuration] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const handleStartCaptureClick = useCallback(() => {
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm",
        });
        mediaRecorderRef.current.addEventListener("dataavailable", ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => [...prev, data]);
            }
        });
        mediaRecorderRef.current.start();

        const id = setInterval(() => {
            setDuration((prevDuration) => prevDuration + 1);
        }, 1000);
        setIntervalId(id);
    }, []);

    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
        if (intervalId) {
            clearInterval(intervalId);
        }
        setDuration(0); // Reset duration
    }, [intervalId]);

    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = url;
            a.download = 'react-webcam-stream-capture.webm';
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setRecordedChunks([]);
        }
    }, [recordedChunks]);

    // Helper function to format duration
    const formatDuration = useCallback((duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            <Webcam audio={false} ref={webcamRef} style={{ margin: '0 auto', display: 'block' }} />
            {capturing ? (
                <>
                    <button onClick={handleStopCaptureClick} style={{ margin: '10px' }}>Stop Capture</button>
                    <div style={{ color: 'black' }}>Recording: {formatDuration(duration)}</div>
                </>
            ) : (
                <button onClick={handleStartCaptureClick} style={{ margin: '10px' }}>Start Capture</button>
            )}
            {recordedChunks.length > 0 && (
                <button onClick={handleDownload} style={{ margin: '10px' }}>Download</button>
            )}
        </div>
    );
};

export default WebcamStreamCapture;