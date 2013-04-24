/*! This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

const sysevents = require("sdk/system/events");

/**
	* @param {tab} jetpack tab object
  * @return obj with keys `tabid`, `windowid`
  *
  * @note windowid is fake for now.
  */
let where = exports.where = function(tab) {
	return {tabid: tab.id, windowid:  12345}
}

/** emits to "micropilot-user-actions"
 * @return obj
 */
let emit = exports.emit = function(obj) {
	sysevents.emit("micropilot-user-events",{subject:null,data:obj})
	console.log("emit:",JSON.stringify(obj));
	return obj
};