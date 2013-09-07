function pizza (
	name,
	imgURL,
	description,
	ingredients,
	small,
	large,
	jumbo,
	id	
	) {
	var self=this;

	self.name = ko.observable(name);
	self.imgURL = ko.observable(imgURL);
	self.description = ko.observable(description);
	self.ingredients = ko.observable(ingredients);
	self.small = ko.observable(small);
	self.large = ko.observable(large);
	self.jumbo = ko.observable(jumbo);
	self.id = ko.observable(id);
}

function MenuViewModel() {

	var self = this;
	self.initError = false;

  // Sammy.js used as router, available as self.orderRouter
  self.orderRouter = Sammy(function() {
    console.log("Sammy()");
    // list route
    this.get('#/list', function() {
      console.log("Window: list");
      self.currentWindow('list');
    });

    this.get('#/edit', function() {
      console.log('route = #/edit')
      this.app.setLocation('#/edit/' + self.orders()[0].id);
    });

    // order processing (numbered order)
    this.get('#/obrada/:order', function() {
      self.currentWindow('obrada');
      // self.currentOrderContext(this.params.order);
      var orderId = this.params.order;
      console.log("Window: " + self.currentWindow() + "  currentOrder " + orderId);
      var order = $.grep(self.orders(), function(e){ return orderId == e.id; })[0];

      self.currentOrderContext.id(order.id);
      self.currentOrderContext.userName(order.userName),
      self.currentOrderContext.userAddress(order.userAddress);
      self.currentOrderContext.userPhone(order.userPhone);
      self.currentOrderContext.userNote(order.userNote);
      self.currentOrderContext.createdAt(order.createdAt);       
      
      // let's get the current order lines

      console.log('Current Order Context before orderLine fetch'); 
      console.log(ko.toJS(self.currentOrderContext));

      self.currentOrderContext.orderLines.removeAll();

      try {
        // get order lines for current order
        $.getJSON("/orderline?order="+this.params.order).done(function(orderJSON){
          console.log("OrderLine succes: "); 
          console.log(orderJSON);

          // feed order lines to current order context
          for (var i = orderJSON.length - 1; i >= 0; i--) {
            self.currentOrderContext.orderLines.push(new orderLine(orderJSON[i].pizzaSize, orderJSON[i].pizza));
          };
          console.log('Order stuffed:');
          console.log(self.currentOrderContext.orderLines());
          self.currentOrderContext.orderLines.valueHasMutated();

        }).fail(function(data){
           console.log("getJSON fail at order lines: " + data)
           $('#init_error_window').fadeIn('fast');
           $('#error_window_content').append("<pre>" + data.toString() + "</pre>");
        });
      } catch (err) {
        console.log("getJSON, caught exception at order lines: " + err)
        $('#init_error_window').fadeIn('fast');
        $('#error_window_content').append("<pre>" + err.toString() + "</pre>");
      };

    }); // end get obrada order

    // set list as default route
    this.get('', function() {
      console.log("Adressed root route.");
      this.app.runRoute('get', '#/list');
    });
   
  }).run(); // run Sammy, run!

}