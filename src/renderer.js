/**
Tweetship renderer.js

Copyright (c) 2018 ayame.space

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

const { ipcRenderer } = require('electron')

window.addEventListener('load', () => {
	ipcRenderer.send('ipc', {})
})
