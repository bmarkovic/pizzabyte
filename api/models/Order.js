/*---------------------
	:: Order
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
		userName: 'STRING',
		userPhone: 'STRING',
		userAddress: 'STRING',
		userNote: 'STRING',
		isProcessed: 'INTEGER'
	}

};
