/**
Tweetship main.js

Copyright (c) 2018 ayame.space

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

const electron = require('electron')
const shell = electron.shell
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipcMain = electron.ipcMain
const path = require('path')
const fs = require("fs")

// メインウィンドウ
let mainWindow

// ウィンドウサイズを保存するファイル
let boundsFile = path.join(
	app.getPath('userData'), 'bounds.json'
);
// 保存しておいたウィンドウサイズの取得
let bounds = null
try {
	bounds = JSON.parse(fs.readFileSync(boundsFile, 'utf8'))
} catch (e) {
	bounds = { "width":1024, "height":768 }
}

function createMenu() {
	// メニューバーの項目を設定
	const menuTemplate = [
		{
			label: 'Edit',
			submenu: [
				{role: 'undo'},
				{role: 'redo'},
				{type: 'separator'},
				{role: 'cut'},
				{role: 'copy'},
				{role: 'paste'},
				{role: 'pasteandmatchstyle'},
				{role: 'delete'},
				{role: 'selectall'},
				{type: 'separator'},
				{
					label: 'Select Accounts',
					submenu: [
						{
							label: '1st Account',
							accelerator: 'CmdOrCtrl+1',
							click(item, focusedWindow) {
								mainWindow.webContents.executeJavaScript('if(document.getElementsByClassName("compose-account").length > 0) document.getElementsByClassName("compose-account")[0].click()')
							}
						},
						{
							label: '2nd Account',
							accelerator: 'CmdOrCtrl+2',
							click(item, focusedWindow) {
								mainWindow.webContents.executeJavaScript('if(document.getElementsByClassName("compose-account").length > 1) document.getElementsByClassName("compose-account")[1].click()')
							}
						},
						{
							label: '3rd Account',
							accelerator: 'CmdOrCtrl+3',
							click(item, focusedWindow) {
								mainWindow.webContents.executeJavaScript('if(document.getElementsByClassName("compose-account").length > 2) document.getElementsByClassName("compose-account")[2].click()')
							}
						},
						{
							label: '4th Account',
							accelerator: 'CmdOrCtrl+4',
							click(item, focusedWindow) {
								mainWindow.webContents.executeJavaScript('if(document.getElementsByClassName("compose-account").length > 3) document.getElementsByClassName("compose-account")[3].click()')
							}
						},
						{
							label: '5th Account',
							accelerator: 'CmdOrCtrl+5',
							click(item, focusedWindow) {
								mainWindow.webContents.executeJavaScript('if(document.getElementsByClassName("compose-account").length > 4) document.getElementsByClassName("compose-account")[4].click()')
							}
						},
						{
							label: '6th Account',
							accelerator: 'CmdOrCtrl+6',
							click(item, focusedWindow) {
								mainWindow.webContents.executeJavaScript('if(document.getElementsByClassName("compose-account").length > 5) document.getElementsByClassName("compose-account")[5].click()')
							}
						},
						{
							label: '7th Account',
							accelerator: 'CmdOrCtrl+7',
							click(item, focusedWindow) {
								mainWindow.webContents.executeJavaScript('if(document.getElementsByClassName("compose-account").length > 6) document.getElementsByClassName("compose-account")[6].click()')
							}
						},
						{
							label: '8th Account',
							accelerator: 'CmdOrCtrl+8',
							click(item, focusedWindow) {
								mainWindow.webContents.executeJavaScript('if(document.getElementsByClassName("compose-account").length > 7) document.getElementsByClassName("compose-account")[7].click()')
							}
						},
						{
							label: '9th Account',
							accelerator: 'CmdOrCtrl+9',
							click(item, focusedWindow) {
								mainWindow.webContents.executeJavaScript('if(document.getElementsByClassName("compose-account").length > 8) document.getElementsByClassName("compose-account")[8].click()')
							}
						},
						{
							label: '10th Account',
							accelerator: 'CmdOrCtrl+0',
							click(item, focusedWindow) {
								mainWindow.webContents.executeJavaScript('if(document.getElementsByClassName("compose-account").length > 9) document.getElementsByClassName("compose-account")[9].click()')
							}
						},
					]
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{role: 'reload'},
				{role: 'forcereload'},
				{role: 'toggledevtools'},
				{type: 'separator'},
				{role: 'resetzoom'},
				{role: 'zoomin'},
				{role: 'zoomout'},
				{type: 'separator'},
				{role: 'togglefullscreen'}
			]
		},
		{
			role: 'window',
			submenu: [
				{role: 'minimize'},
				{role: 'close'}
			]
		}
	]
	
	if (process.platform === 'darwin') {
		menuTemplate.unshift({
			label: app.getName(),
			submenu: [
				{role: 'about'},
				{type: 'separator'},
				{role: 'services', submenu: []},
				{type: 'separator'},
				{role: 'hide'},
				{role: 'hideothers'},
				{role: 'unhide'},
				{type: 'separator'},
				{role: 'quit'}
			]
		})
		
		// 編集メニュー
		menuTemplate[1].submenu.push(
			{type: 'separator'},
			{
				label: 'Speech',
				submenu: [
					{role: 'startspeaking'},
					{role: 'stopspeaking'}
				]
			}
		)
		
		// ウインドウメニュー
		menuTemplate[3].submenu = [
			{role: 'close'},
			{role: 'minimize'},
			{role: 'zoom'},
			{type: 'separator'},
			{role: 'front'}
		]
	}
	const menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu)
}

function addCSS(){
	// メインウインドウにCSSを追加
	mainWindow.webContents.insertCSS(
	    `
        .app-header {
            -webkit-app-region: drag;
        }
        .app-content, column-nav-item{
            -webkit-app-region: no-drag;
        }
        .is-condensed .attach-compose-buttons .tweet-button {
            width: 64px;
            padding-left: 4px;
        }
        .is-condensed .app-content {
            left: 78px;
        }
        .column-navigator {
            top: 155px;
        }
        .app-header .app-header-inner {
            padding-top: 36px;
        }
        .app-header.is-condensed .app-header-inner {
            width: 64px;
            padding: 36px 7px 3px 7px;
            box-sizing: border-box;
            margin: 0 7px;
        }
        .is-condensed .app-header {
            width: 78px;
        }
        `.replace(/;/g, '!important;')
	)
}

ipcMain.on('ipc', (event, args) => {
	
	
	// Macの場合CSSを編集する
	if (process.platform == 'darwin') {
		addCSS()
	}
	
	// リンクが開かれたときの処理
	mainWindow.webContents.on('new-window', (event, url) => {
		event.preventDefault()
		shell.openExternal(url)
	})
	
	createMenu()
	
	// メインウインドウが閉じられる前の処理
	mainWindow.on('close', () => {
		fs.writeFileSync(
			boundsFile, JSON.stringify(mainWindow.getBounds())
		)
	})
	
})

function createWindow() {
	// メインウィンドウを作成
	mainWindow = new BrowserWindow(Object.assign(bounds, {
		useContentSize: true,
		title: 'Tweetship',
		titleBarStyle: 'hiddenInset',
		icon: __dirname + '/icon/icon.png',
		backgroundColor: '#1DA1F2',
		webPreferences: {
			sandbox: true,
			preload: path.resolve(path.join(__dirname, "renderer.js"))
		}
	}))
	
	// メインウィンドウにtweetdeckを表示
	mainWindow.loadURL('https://tweetdeck.twitter.com/')
	
	// スリープから復帰した際の処理
	electron.powerMonitor.on('resume', () => {
		mainWindow.reload()
	})
	
	// メインウィンドウが閉じられたときの処理
	mainWindow.on('closed', () => {
		app.quit()
	});
}

// 初期化が完了した時の処理
app.on('ready', () =>{
	createWindow()
});

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
	app.quit()
});