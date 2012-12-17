Analytics
=========

Analytics is a plugin for videojs which provides the recording and sending of several video based metrics to google. These metrics are as written below:

- **Play**: Triggers when the video is played for the first time. Will only trigger once per page load. (Analytics Event name: "Play")
- **Pause**: Triggers anytime the video is paused. Can trigger multiple times during a video watch. (Analytics Event name: "Pause")
- **Error**: Triggers anytime an error is thrown by the javascript. Can trigger multiple times during a video watch. (Analytics Event name: "Error")
- **Share** : This is for use with the share plugin. This will trigger anytime one of the share sources is clicked. It should be noted that clicking one of the share sources and actually sharing the video might be slightly different metrics this is because of visitor who visit the share page but fail to follow through with sharing. (Analytics Event name: "Share")
- **QualityChange** : This is for use with the resolution switching plugin. This will trigger anytime the resolution is switched and will return a different event based upon the new resolution.  (Analytics Event name: QualityChange_* where * is the resolution, e.g. QualityChange_1080p).
- **LoadingDuration** : This triggers when the user leaves the page. The value recorded by this event is the amount of time the user spent loading the video  (Analytics Event name: LoadingDuration).
- **VideoWatched** : This will trigger whenever the user reaches a specific point in the video. The specific times where the event is triggered are (in seconds) 0.5, 5, 10, 15, 30, 45, 60, 90, 120, 150, 180 and so on in multiples of 30 seconds. This gives greater accuracy over the first minute of video with less later on. (Analytics Event name: VideoWatched_* where * is the time, e.g. QualityChange_45).


Using analytics.js
------------------
In order to use Analytics.js include a link to it it on a page after including video.js. 

e.g.

	<script src="http://vjs.zencdn.net/c/video.js"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/videojs-google-analytics.js")" ></script>
	
	
Note: This plugin will initialize videojs on startup if not already done so.

 
