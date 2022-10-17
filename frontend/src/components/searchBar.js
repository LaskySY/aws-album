import React, { useState } from 'react'
import axios from 'axios'
import { updateImage } from '../slice/images'
import { useDispatch } from 'react-redux'
import { Link } from "react-router-dom"
import upload from '../images/upload.svg'
import mic from '../images/mic.svg'
import '../css/searchbar.css'
import { StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import MicrophoneStream from "microphone-stream";
import { transcribeClient, pcmEncodeChunk } from './utils'

const SearchBar = () => {
    const [searchVal, setSearchVal] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    // var micStream;
    async function start() {
        setSearchVal('')
        setIsRecording(true)
        try {
            // Start the browser microphone.
            const micStream = new MicrophoneStream();
            micStream.setStream(
                await window.navigator.mediaDevices.getUserMedia({
                    video: false,
                    audio: true,
                })
            );
            // Acquire the microphone audio stream.
            const audioStream = async function* () {
                for await (const chunk of micStream) {
                    yield {
                        AudioEvent: {
                            AudioChunk: pcmEncodeChunk(
                                chunk
                            ) /* pcm Encoding is optional depending on the source. */,
                        },
                    };
                }
            };

            const command = new StartStreamTranscriptionCommand({
                // The language code for the input audio. Valid values are en-GB, en-US, es-US, fr-CA, and fr-FR.
                LanguageCode: "en-US",
                // The encoding used for the input audio. The only valid value is pcm.
                MediaEncoding: "pcm",
                // The sample rate of the input audio in Hertz.
                MediaSampleRateHertz: 44100,
                AudioStream: audioStream(),
            });

            // Send the speech stream to Amazon Transcribe.
            const data = await transcribeClient.send(command);
            console.log("Success", data.TranscriptResultStream);
            // return data; //For unit tests only.
            for await (const event of data.TranscriptResultStream) {
                for (const result of event.TranscriptEvent.Transcript.Results || []) {
                    if (result.IsPartial === false) {
                        const noOfResults = result.Alternatives[0].Items.length;
                        // Print results to browser window.
                        var sent = ''
                        for (let i = 0; i < noOfResults; i++) {
                            const outPut = result.Alternatives[0].Items[i].Content;
                            if (![".", ",", ":", "!", "?"].includes(outPut))
                                sent += outPut + ' '
                        }
                        console.log(sent)
                        setSearchVal(sent)
                        micStream.stop()
                        setIsRecording(false)
                        document.getElementById('searchbar').focus()
                        break;
                    }
                }
            }
            console.log("Success. ", data);
        } catch (err) {
            console.log("Error. ", err);
        }
    }
    function stop() {
        setIsRecording(false)
        window.location.reload();
    }

    const dispatch = useDispatch()
    function handleSearch(e) {
        if (e.key === 'Enter') {
            let value = document.getElementById('searchbar').value
            var url = process.env.REACT_APP_BASE_API + '/search'
            axios.get(url + `?q=${value}`, null, null)
                .then(data => {
                    data = JSON.parse(data.data.body)
                    console.log(data)
                    dispatch(updateImage(data))
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    return (
        <center>
            <div className="bar">
                <input id="searchbar" placeholder="show me ..." onKeyDown={handleSearch}
                    value={searchVal} onChange={e => setSearchVal(e.target.value)} />
                {isRecording
                    ? <div className="recording-circle" onClick={stop} />
                    : <img className="voice" alt='voice-btn' src={mic} onClick={start} />
                }
                <Link to="/upload"><img className="upload" alt='upload-btn' src={upload} /></Link>
            </div>
        </center>

    )
}

export default SearchBar