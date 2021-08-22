export const name = 'timeUtils';

function calcTimeDifference(start) {
	let endTime = new Date();
	// time difference in milliseconds
	let timeDiff = endTime - start;
	// strip the ms
	timeDiff /= 1000;
	// round to two decimalschangeVisibilityOfButtonGridStep('none');
	return timeDiff.toFixed(4);
};



export {calcTimeDifference}