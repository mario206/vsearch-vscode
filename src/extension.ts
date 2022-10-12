// @ts-nocheck

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { commands, ExtensionContext, window } from 'vscode';

var s_last_regex = ""

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vsearch" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('vsearch.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from vsearch!');
	// });

	context.subscriptions.push(commands.registerCommand('vsearch.searchCmd', async () => {
		const input = await window.showInputBox({
			title:"VSearch",
			placeHolder : "to string()",
			value:s_last_regex,
		});
		if (!input) {
			return;
		}

		s_last_regex = input;

		var regexStr = processInputToRegex(input);

		vscode.commands.executeCommand('workbench.action.findInFiles', {
			query: regexStr,
			isRegex: true,
			triggerSearch: true,
		});
	}));

	function permutator(inputArr) {
        var result = [];
        var permute = function permute(arr) {
            var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            if (arr.length === 0) {
                result.push(m)
            } else {
                for (var i = 0; i < arr.length; i++) {
                    var curr = arr.slice();
                    var next = curr.splice(i, 1);
                    permute(curr.slice(), m.concat(next))
                }
            }
        };
        permute(inputArr);
        return result
    }
    function processInputToRegex(inputs) {
        var ret = "";
        var words = inputs.split(" ");
        words = words.filter(function(word) {
            return word.length > 0
        });
        var arr2d = permutator(words);
        for (var i = 0; i < arr2d.length; ++i) {
            ret += "(";
            var vec = arr2d[i];
            for (var j = 0; j < vec.length; ++j) {
                ret += vec[j];
                if (j != vec.length - 1) {
                    ret += ".*"
                }
            }
            ret += ")";
            if (i != arr2d.length - 1) {
                ret += "|"
            }
        }
        console.log(ret);
        return ret
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}
