/*---------------------
	:: OrderLine
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
		pizzaSize: 'STRING',
		order: 'INT',
		pizza:'STRING'		
	}

};
