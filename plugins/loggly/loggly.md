Loggly
======

Loggly.js uses the loggly castor described here: http://loggly.com/support/sending-data/logging-from/application-logs/javascript/ to log errors from the videojs player.

Using Loggly.js
----------------
In order to use Quality.js include a link to it it on a page after including video.js. 

e.g.

	<script src="http://vjs.zencdn.net/c/video.js"></script>
    <script type="text/javascript" src="@Url.Content("~/Scripts/Quality.js")" ></script>
	
You will also need to open Loggly.js and alter the line 'this.key = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";' to use the correct loggly data.

Note: This plugin will initialize videojs on startup if not already done so.