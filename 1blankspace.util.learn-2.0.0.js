/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/

 https://github.com/BrainJS/brain.js#browser
 */
 
"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.brain =
{
	example: 
	{
		book: function()
		{
			const trainingData = [
			  'Jane saw Doug.',
			  'Doug saw Jane.',
			  'Spot saw Doug and Jane looking at each other.',
			  'It was love at first sight, and Spot had a frontrow seat. It was a very special moment for all.'
			];

			const lstm = new brain.recurrent.LSTM();
			const result = lstm.train(trainingData, { iterations: 1500 });
			const run1 = lstm.run('Jane');
			const run2 = lstm.run('Doug');
			const run3 = lstm.run('Spot');
			const run4 = lstm.run('It');

			console.log('run 1: Jane' + run1);
			console.log('run 2: Doug' + run2);
			console.log('run 3: Spot' + run3);
			console.log('run 4: It' + run4);
		},

		xor: function ()
		{
			var net = new brain.NeuralNetwork();

			net.train([{input: [0, 0], output: [0]},  
			           {input: [0, 1], output: [1]},
			           {input: [1, 0], output: [1]},
			           {input: [1, 1], output: [0]}]);

			var output = net.run([1, 0]);
		}
}