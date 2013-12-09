(function() {
	var platino = require('co.lanica.platino');
	var ALmixer = platino.require('co.lanica.almixer');

	ALmixer.Init(0,0,0);

    var Window = require('ApplicationWindow');
    new Window().open({fullscreen:true, navBarHidden:true, exitOnClose:true});
//    new Window().open();



/* You should copy all the event handlers below into your app. 
 * It makes sure that when an app is paused, the audio pauses, and when resumed, audio is resumed.
 * Additionally, when Android exits an app, it calls ALmixer_Quit() which is necessary to make sure
 * the audio system is properly cleaned up, or there could be problems on the next launch.
 */

if (Ti.Platform.osname == 'android')
{
	// Weird bug. pause/resume work in the almixertijstest demo, but not this one.
	// This post seems to have some information on what looks like a Titanium bug.
	// http://developer.appcelerator.com/question/149942/pause--resume-events-dont-fire-android
	// Without these being called, the audio will continue playing when the user switches out of the app which is annoying.
	// As a workaround, I've used the_window 'blur' and 'focus' events to handle this instead.
	/*
	Titanium.Android.currentActivity.addEventListener('pause', 
		function()
		{
			Ti.API.info("in app.js for android pause");
			
 			ALmixer.BeginInterruption();
		}
	);

	Titanium.Android.currentActivity.addEventListener('resume', 
		function()
		{
			Ti.API.info("in app.js for android resume");
			
			ALmixer.EndInterruption();
		}
	);
	Titanium.Android.currentActivity.addEventListener('resumed', 
		function()
		{
			Ti.API.info("in app.js for android resumed");
			
			ALmixer.EndInterruption();
		}
	);
	*/

	Titanium.Android.currentActivity.addEventListener('destroy', 
		function()
		{
			Ti.API.info("android exit called");
			ALmixer.Quit();
		}
	);

}
else
{
	Titanium.App.addEventListener('pause', 
		function()
		{
			Ti.API.info("in app.js for iOS pause");
	 		ALmixer.BeginInterruption();
		}
	);

	// I think this is triggered when resuming Titanium phone call interruptions.
	Titanium.App.addEventListener('resume', 
		function()
		{
			Ti.API.info("in app.js for iOS resume");
			ALmixer.EndInterruption();
		}
	);

	// I think this is triggered for resuming all other paused events.
	Titanium.App.addEventListener('resumed', 
		function()
		{
			Ti.API.info("in app.js for iOS resumed");
			ALmixer.EndInterruption();
		}
	);

}

})();

