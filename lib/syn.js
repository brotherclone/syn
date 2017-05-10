/*
 * syn
 * https://github.com/brotherclone/syn
 *
 * Copyright (c) 2017 Gabriel Walsh
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function() {
	var synaptic = require('synaptic');
  	const { Layer, Network, Trainer, Architect } = synaptic;
	var westernScale = [
		{note:['C'],freq:'261.63'},
		{note:['C#','Db'],freq:'277.18'},
		{note:['D'],freq:'293.66'},
		{note:['D#','Eb'],freq:'311.13'},
		{note:['E'],freq:'329.63'},
		{note:['F','E#'],freq:'349.23'},
		{note:['F#','Gb'],freq:'369.99'},
		{note:['G'],freq:'392.63'},
		{note:['G#','Ab'],freq:'261.63'},
		{note:['A'],freq:'440'},
		{note:['A#','Bb'],freq:'466.16'},
		{note:['B'],freq:'493.88'},
		{note:['C'],freq:'523.25'},
	];
	var majorChords = [['C','E','G'],['C#', 'E#', 'G#'],['D','F#','A'],
	[ 'Eb', 'G', 'Bb'],['E', 'G#', 'B'],['F', 'A', 'C'],['F#', 'A#', 'C#'],
	['G', 'B', 'D'],['Ab', 'C', 'Eb'],[ 'A', 'C#', 'E'],['Bb', 'D', 'F'],['B', 'D#', 'F#']];
	
	var minorChords = [['C', 'Eb', 'G'],['C#', 'E', 'G#'],['D','F','A'],
	['Eb','Gb','Bb'],['E','G','B'],['F','Ab','C'],['F#','A','C#'],
	['G','Bb','D'],['Ab','B','Eb'],['A','C','E'],['Bb','Db','F'],[ 'B','D','F#']];

	for(var i=0; i<westernScale.length; i++){
		westernScale[i].input = (westernScale[i].freq * 0.0001).toFixed(8);
	};
	
	function getFreq(note){
		var frequency;
		for(var i=0; i<westernScale.length; i++){
			for(var n=0; n<westernScale[i].note.length; n++){
				if(westernScale[i].note[n] == note){
					frequency = westernScale[i].input;
				}
			}
		}
		return frequency;
	};

	function buildTrainingChords(chordGroup, isMajor){
		var trainingChords = [];
		for(var i=0; i<chordGroup.length; i++){
			var trainingNotes = {
				input:[],
				output:[Number(isMajor)]
			};
			for(var n=0; n<chordGroup[i].length; n++){
				var note = getFreq(chordGroup[i][n]);
				trainingNotes.input.push(Number(note));
			}
			trainingChords.push(trainingNotes);
		}
		return trainingChords;
	};

	var trainingMajor = buildTrainingChords(majorChords, true);
	var trainingMinor = buildTrainingChords(minorChords, false);
	var trainingMusic = trainingMajor.concat(trainingMinor);
	var myNetwork = new Architect.Perceptron(3, 2, 1);
	var trainer = new Trainer(myNetwork);

	trainer.train(trainingMusic,{
		iterations: 20000,
		shuffle: true,
		error: .005
	});
	var cMajor = [westernScale[0].input,westernScale[5].input,westernScale[7].input];
	var guess = Math.round(myNetwork.activate(cMajor));
	if(guess){
		return 'It is major.'
	}else{
		return 'It is minor.'
	}
};
