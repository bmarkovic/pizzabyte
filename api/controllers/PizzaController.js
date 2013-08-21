/*---------------------
	:: Pizza 
	-> controller
---------------------*/
var PizzaController = {

    haveSome: function(req, res) {
    	res.send('Ahh, you want some, do ya?', { 'Content-Type': 'text/plain' }, 201);
    }
};
module.exports = PizzaController;