"use strict";

//open/activate
//chrome events; event handlers
//in content?

const { getTabs, getTabId, getOwnerWindow } = require("sdk/tabs/utils");

function getWindowFromWrappedTab(tab) {
	if (!tab) return null;

	let rawTabs = getTabs();

	for (let rawTab of rawTabs) {
		if (getTabId(rawTab) === tab.id)
			return getOwnerWindow(rawTab)
	}
	return null;
}


const {emit} =  require("./utils");
const {getOwnerWindow} = require("tabs/utils")
const {getOuterId} = require("window/utils")

var newWinFun = {
  onTrack: function (window) {
    emit("Tracking a window: " + window.location, + ", " + window.id);
  },
  onUntrack: function (window) {
    emit("Untracking a window: " + window.location);
  }
};

var tabs = require("sdk/tabs");

tabs.on('open', function onOpen(tab) {
	emit("Tab opened: " + tab.id)
	console.log("Tab opened: ", tab.id, "window:", getOuterId(getWindowFromWrappedTab(tab)))
});

tabs.on('ready', function onOpen(tab) {
	emit("Tab ready: " + tab.id)
	console.log("Tab ready: ", tab.id, "window:", getOuterId(getWindowFromWrappedTab(tab)))
});
//all tabs events

//note actions that are being pushed directly



let chromeEvents = function(){

}

let windowEventTracker = function(){
	var winUtils = require("window-utils");
	var tracker = new winUtils.WindowTracker(newWinFun);
}();

let tabEventTracker = function(){


}();

//isbrowser()? --> jetpack


//pump out onto a channel and recording into instrument options
//require unload; remove contextMenuTracker etc



//window vs chrome