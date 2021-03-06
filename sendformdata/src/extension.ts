import * as vscode from 'vscode';
import { Uri,workspace } from 'vscode';
import FormData = require('form-data');
const fs = require('fs');
var request = require('request');

export function activate(context: vscode.ExtensionContext) {
	
	
	console.log('Congratulations, your extension "sendformdata" is now active!');

	let sendtext = vscode.commands.registerCommand('sendformdata.sendtext',(uri:Uri, items: Uri[])=>{
		var formdata = new FormData();
		const workspacefolder = workspace.getWorkspaceFolder(Uri.file(items[0].path))?.uri.path;

		formdata.append('file', fs.createReadStream(items[0].path));
		console.log(formdata);

		formdata.submit('http://127.0.0.1:8000/',function(err, res){
			if(err) throw err;
			if(res){
				var wstream = fs.createWriteStream(workspacefolder + "/RESULTS.txt");
				
				res.on('data',function(data){
					wstream.write(data);
				});
				res.on('end',function(){
					wstream.end();
				});
				res.on('error',function(err){
					console.log('something is wrong');
					wstream.close();
				});
				console.log("RES 성공");
			}
		});

	});

	let disposable = vscode.commands.registerCommand('sendformdata.helloWorld', (uri: Uri, items : Uri[]) => {

		var formData = new FormData();
		const workspacefolder = workspace.getWorkspaceFolder(Uri.file(items[0].path))?.uri.path;

		formData.append("file",fs.createReadStream(items[0].path));
		console.log(formData);

		//Local host :        http://127.0.0.1:8000/
		//ONNX-CONNX Server : https://mysite-tscvl.run.goorm.io/
		formData.submit('https://mysite-tscvl.run.goorm.io/rest_api_test/', function(err, res){
			if(err) throw err;
			if(res){			
				console.log(res);
				console.log("RES 받음");
				var wstream = fs.createWriteStream(workspacefolder + "/test.zip");
				
				res.on('data',function(data){
					wstream.write(data);
				});
				res.on('end',function(){
					wstream.end();
				});
				res.on('error',function(err){
					console.log('something is wrong');
					wstream.close();
				});
				console.log("RES 성공");	
			}
			console.log('Done');
		});		
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
