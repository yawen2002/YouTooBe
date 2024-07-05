import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import flagIcon from '../../assets/flag-icon.png';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';

const PlayVideo = ({ videoId }) => {
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [transcription, setTranscription] = useState(''); // State for transcription

    const fetchVideoData = async () => {
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&key=${API_KEY}&id=${videoId}`;
        await fetch(videoDetails_url)
            .then(res => res.json())
            .then(data => setApiData(data.items[0]));
    };

    const fetchOtherData = async () => {
        if (apiData) {
            // Fetching Channel Data
            const channelLogo_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
            await fetch(channelLogo_url)
                .then(res => res.json())
                .then(data => setChannelData(data.items[0]));

            // Fetching Comment Data
            const videoComment_url = `https://www.googleapis.com/youtube/v3/commentThreads?textFormat=plainText&part=snippet&maxResults=50&key=${API_KEY}&videoId=${videoId}`;
            await fetch(videoComment_url)
                .then(res => res.json())
                .then(data => setCommentData(data.items));
        }
    };

    // Function to fetch transcription from the backend
    const fetchTranscription = async (videoUrl) => {
        try {
            const response = await fetch('http://localhost:5000/transcribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: videoUrl }),
            });

            if (response.ok) {
                const data = await response.json();
                setTranscription(data.transcription);
            } else {
                setTranscription('Error fetching transcription');
            }
        } catch (error) {
            setTranscription('Error fetching transcription');
        }
    };

    useEffect(() => {
        fetchVideoData();
        window.scrollTo(0, 0);
    }, [videoId]);

    useEffect(() => {
        fetchOtherData();
    }, [apiData]);

    useEffect(() => {
        // Fetch transcription when videoId changes
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        fetchTranscription(videoUrl);
    }, [videoId]);

    const handleMoreInfo = () => {
        alert(`More info about: ${apiData.snippet.title}`);
    };

    const handleFlag = () => {
        alert(`Flagged: ${apiData.snippet.title}`);
    };

    return (
        <div className="play-video">
            <iframe 
                src={`https://www.youtube.com/embed/${videoId}?&autoplay=1&rel=0`} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
            ></iframe>
            <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
            <div className="play-video-info">
                <p>{apiData ? value_converter(apiData.statistics.viewCount) : 1525} Views  &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : "2 days ago"}</p>
                <div>
                    <span><img src={like} alt="" />{apiData ? value_converter(apiData.statistics.likeCount) : 125}</span>
                    <span><img src={dislike} alt="" />2</span>
                    <span><img src={share} alt="" />Share</span>
                    <span><img src={save} alt="" />Save</span>
                </div>
            </div>
            <hr />
            <div className="publisher">
                <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt="" />
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "1M"} Subscribers</span>
                </div>
                <div className="action-buttons">
                    <button onClick={handleMoreInfo} className="more-info-button">More Information</button>
                    <button onClick={handleFlag} className="flag-button"><img src={flagIcon} alt="Flag" /></button>
                </div>
            </div>
            <div className="vid-description">
                <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description Here"}</p>
                <hr />
                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 130} Comments</h4>

                {commentData.map((item, index) => {
                    return (
                        <div key={index} className="comment">
                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                            <div>
                                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
                                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className="comment-action">
                                    <img src={like} alt="" />
                                    <span>{item.snippet.topLevelComment.snippet.likeCount}</span>
                                    <img src={dislike} alt="" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Display the transcription */}
            <div id="transcription-container">
                <h2>Transcription</h2>
                <p id="transcription">{transcription}</p>
            </div>
        </div>
    );
};

export default PlayVideo;
