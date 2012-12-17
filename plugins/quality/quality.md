Quality
=======

Quality.js is a plugin for videojs which provides the ability to change the resolution of the wideo while it is being watched. Sources are marked up with a "data-res" attribute which specifies the resolution of the source (e.g. "420p"). This functionality only applies to sources of identical mimetype and only to the html5 player.

Using quality.js
----------------
In order to use Quality.js include a link to it it on a page after including video.js. 

e.g.

	<script src="http://vjs.zencdn.net/c/video.js"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/Quality.js")" ></script>
	
	
Note: This plugin will initialize videojs on startup if not already done so.

 
