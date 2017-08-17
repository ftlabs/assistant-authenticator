const express = require('express');
const router = express.Router();

const debug = require('debug')('routes:index');
const uuid = require('uuid').v4;
const isEqual = require('lodash.isequal');

const combinationsDictionary = [
	'Banana',
	'Cat',
	'Apple',
	'Lemon',
	'Kite',
	'Banjo',
	'Iron',
	'Coffee',
	'Markets'
];

const wordsForDevices = {};

function checkMagicWordsAreUnique(magicWords){

	let isUnique = true;

	Object.keys(wordsForDevices).forEach(key => {

		if( isEqual( wordsForDevices[key], magicWords) ){
			isUnique = false;
		}

	});	

	return isUnique;

}

function generateMagicWords(){

	const localDictionary = [...combinationsDictionary];
	const chosenWords = [];

	for(let x = 0; x < 3; x += 1){
		chosenWords.push( localDictionary.splice( Math.random() * localDictionary.length | 0, 1 )[0] );
	}

	if(!checkMagicWordsAreUnique){
		return generateMagicWords();
	} else {
		return chosenWords;
	}


}


/* GET home page. */
router.get('/', (req, res) => {
	
	if(!req.cookies['ftlabsAssistantAuth']){
		const thisUUID = uuid();
		const cookieOptions = { httpOnly : false, maxAge : 1000 * 60 * 60 * 24 * 10 };
		
		res.cookie('ftlabsAssistantAuth', thisUUID, cookieOptions);
	}

	res.render('index', { title: 'assistant-authenticator' });
});

router.get('/magic-words', (req, res) => {

	
	const thisDeviceID = req.cookies['ftlabsAssistantAuth'];
	const wordsForThisDevice = wordsForDevices[thisDeviceID];
	
	debug(thisDeviceID);
	
	if(wordsForThisDevice !== undefined){

		res.json({
			words : wordsForThisDevice
		});

	} else {

		const chosenWords = generateMagicWords();

		wordsForDevices[thisDeviceID] = chosenWords;

		res.json({
			words : chosenWords
		});

	}

});

router.post('/link', (req, res) => {
	res.end();
});

module.exports = router;
