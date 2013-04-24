

"use strict";
//ad clicks for google (known to be an undercount) PRIORITY 1
//about:home, landing, searches, widgets
//what's new page
//newtab
//potential hits on any of the 6 major search engines instead of using searchbar, etc (undercount)

//track "interaction-level" proxies, such as clicks and scrolls and gestures
//	--> on click, window document, allow propagation, allow to bubble back up through stack
//window.document.addEventListener("click",function(){console.log("got one")},true)
//all javascript events: http://www.quirksmode.org/dom/events/index.html

/*
08:05 < gregglind> tabs.on("open",function(tab) log({tabid: tab.id /works!/,  windowid: ???}))
08:05 < gregglind> # for the 2nd question
08:06 < gregglind> # for q1....
08:06 < gregglind> I want to know every time the user clicks in the content frame.  What's the right way of instrumenteing that?
08:08 < gregglind> I want to see resulting things like:   {ts: Date.now(), windowid: <>,  tabid: <>,  what:  "content-click", location: <url>}
08:08 < gregglind> should I use a pageMod on * ?
08:11 <@ZER0> for the first question: window doesn't have one id, it has inner id and outer id, so what are you referring to?
08:12 <@ZER0> in both case we do not expose this such ids to high level API; also expose this such thing from C to JS was something discussed.
08:13 <@ZER0> for the second question: it's really depends by your use case; you want to know when the user clicks in every page (local, remote, etc) loaded as content
              in the browsers?
08:13 < gregglind> ZERO, outer id.  The window window.
08:14 < gregglind> window/utils . getOuterId(tab.window) doesn't work.
08:14 <@ZER0> gregglind, of course not
08:14 <@ZER0> gregglind, tab.window is an SDK window, where window/utils is a low level API, that takes "real" (DOM/Chrome) Window
08:15 < gregglind> And yes, I want to know when the user clicks in every page.
08:16 -!- davida [davida@moz-528B05B4.vc.shawcable.net] has joined #jetpack
08:16 <@ZER0> gregglind, you have to use the tabs/utils to get the Window related to the tab, I guess `getOwnerWindow` should do the trick, and then pass it to the
              `getOuterId` function
08:16 < gregglind> To understand how users interact with content, and how it looks differently between 'reading' and 'interacting with applications' and such.
08:16 < gregglind> ah, that sounds like a good plan.  'getOwnerWindow' was what I was missing!  Thanks.
08:17 < gregglind> anything lighter than pageMod for #2?
08:17 <@ZER0> gregglind, so I think `PageMod` with `attachTo['top', 'frame', 'existing']` should do what you need
08:17 -!- kinger [Adium@moz-AE142C90.dial-up.dsl.siol.net] has quit [Quit: Leaving.]
08:17 < gregglind> RIght on, thanks so much for the help.
08:17 <@ZER0> If it was only for certain case it could be maybe better `tab.attach`
*/

let utils = require("utils");

let {getOuterId} = require("window/utils");

/* window.location.href:  tends to be browser.xul
   window.gBrowser.contentDocument.location.href -> whatever it really is
*/

require("sdk/deprecated/window-utils").WindowTracker({
	onTrack: function(window){
		//if (isBrowser(window)) return
		window.document.addEventListener("click",function(){
			utils.emit({
				group:"chrome-content",
				location: window.location.href,
				windowid:  getOuterId(window), //window.id,
				ts: Date.now()
			})
		})

		window.document.getElementById("appcontent").addEventListener("click",function(){
			utils.emit({
				group:"app-content",
				location: window.gBrowser.contentDocument.location.href, //window.location.href,
				windowid:  getOuterId(window),
				ts: Date.now()
			})
		})
	}
});

var pageMod = require("page-mod");

pageMod.PageMod({
  include: /.*/,   // if we want 'resource' and such as well
  contentScript: 'window.document.addEventListener("click",function(){console.log("got it!", window.location.href)},true)',
  attachTo:["existing","top","frame"]
});
