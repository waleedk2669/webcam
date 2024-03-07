import { useState, useCallback, useEffect } from 'react';

export const useMediaRecorder = (webcamRef, setRecordedChunks) => {
    const [capturing, setCapturing] = useState(false);

    const handleDataAvailable = useCallback(({ data }) => {
        if (data.size > 0) {
            setRecordedChunks(prev => [...prev, data]);
        }
    }, [setRecordedChunks]);

    const startRecording = useCallback(() => {
        if (webcamRef.current) {
            setCapturing(true);
            const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
                mimeType: "video/webm",
            });
            mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
            mediaRecorder.start();

            // Cleanup on stop
            const stopRecording = () => {
                mediaRecorder.stop();
                setCapturing(false);
                mediaRecorder.removeEventListener("dataavailable", handleDataAvailable);
            };

            return stopRecording;
        }
    }, [webcamRef, setCapturing, handleDataAvailable]);

    useEffect(() => {
        let stopRecording;
        if (capturing) {
            stopRecording = startRecording();
        }
        return () => {
            if (stopRecording) stopRecording();
        };
    }, [capturing, startRecording]);

    return {
        capturing,
        startRecording: () => setCapturing(true),
        stopRecording: () => setCapturing(false)
    };
};
