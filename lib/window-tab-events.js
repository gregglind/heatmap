"use strict";

const {eventOf, winIdFromTab, emit} =  require("./utils");
const tabs = require("sdk/tabs");
const windows = require("sdk/windows").browserWindows;
const winUtils = require("sdk/deprecated/window-utils");
const {getTabs, getTabId, getOwnerWindow} = require("sdk/tabs/utils");
const {getOuterId,isWindowPrivate,isBrowser,getMostRecentBrowserWindow} = require("sdk/window/utils");

//onfocus??
//on minimize?
var newWinFun = {
  	onTrack: 
  		function (window) {
		  	if (!isBrowser(window)) return;
			  	emit({
			  		group:"window",
			  		action:"tracking",
			  		isPrivate:isWindowPrivate(window),
					win_id: getOuterId(window),
					ts: Date.now()
			  	});
		},
	onUntrack:
		function (window) {
		  	if (!isBrowser(window)) return;
			  	emit({
			  		group:"window",
			  		action:"untracking",
					win_id: getOuterId(window),
					ts: Date.now()
			  	});
		}
}


//tab drag??
//tab reorder??
//listen for pinning, mark as reload?


//obj description = describeTab(tab) -> return {isPinned:, etc..)
//let d = describeTab(tab);  d.ts = date.now(), d.action  emit(d)
//eventOf ts, group, action
//emit(eventOf("open",describeTab(tab)))

//record privacy of tab?

let describeTab = function(tab) {
	let desc = {};
	desc["group"]="tabs";
	desc["window_id"]=winIdFromTab(tab);
	desc["pinned"]=tab.isPinned;
	desc["url"]=tab.url;
	desc["tab-id"]=tab.id;
	return desc;
}

let basicTabEvents = function() {
	tabs.on("open", function(tab) {
		emit(eventOf("tab-open", describeTab(tab)));
	});
	tabs.on("ready", function(tab) {
		emit(eventOf("tab-ready", describeTab(tab)));
	});
	tabs.on("activate", function(tab) {
		emit(eventOf("tab-activate", describeTab(tab)));
	});
	tabs.on("deactivate", function(tab) {
		emit(eventOf("tab-deactivate", describeTab(tab)));
	});
	tabs.on("close", function(tab) {
		emit(eventOf("tab-close", describeTab(tab)));
	});
}();


//Should we track reload as a reload button press followed by a load?
//record lifespan at death?

//note actions that are being pushed directly

let windowEventTracker = function(){
	var tracker = new winUtils.WindowTracker(newWinFun);  
}();