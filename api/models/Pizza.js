/*---------------------
	:: Pizza
	-> model
---------------------*/
module.exports = {

	attributes: {

		// Simple attribute:
		// name: 'STRING',

		// Or for more flexibility:
		// phoneNumber: {
		//	type: 'STRING',
		//	defaultsTo: '555-555-5555'
		// }
		name: 'STRING',
	    imgURL: 'STRING',
	    description: 'STRING',
	    ingredients: 'STRING',
	    special: 'STRING',
	    small: 'FLOAT',
	    large: 'FLOAT',
	    jumbo: 'FLOAT'		
	}

};
