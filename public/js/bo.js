moment.lang('hr');

// ----------- Model and fixtures

// OrderLine - main model
function orderLine(pizzaSize, orderedPizza) {
    console.log("function orderlLine()");
    var self = this;
    self.pizzaSize = ko.observable(pizzaSize);
    self.pizza = ko.observable(orderedPizza);
}

$(document).keyup(function(e) {
  var currentWindow = viewModel.currentWindow();
  console.log("KesPress, currentWindow = " + currentWindow);
  switch (e.keyCode) {
    case 27: {
      console.log("ESC keypress detected");
      if (currentWindow == 'obrada') {
        viewModel.orderRouter.setLocation('#/list');
      }
    }
    case 13: {
      console.log('ENTER keypress detected');
      if (currentWindow == 'list' || currentWindow == '') {
        viewModel.orderRouter.setLocation('#/obrada')
      }
    }
  }
});

//  ---------- ViewModel

function OrdersViewModel() {

  var self = this;

  // inital housecleaning.
  self.currentWindow = ko.observable('list');
  self.showOrderMenu = ko.observable(false);
  self.initError = false;

  // outer model data
  self.currentOrderContext = {
    id: ko.observable(0),
    userName: ko.observable(),
    userAddress: ko.observable(),
    userPhone: ko.observable(),
    userNote: ko.observable(),
    createdAt: ko.observable(Date.now()),
    orderLines: ko.observableArray([
     {
        pizza:  ko.observable('Margharita'),
        pizzaSize: ko.observable('small')
     }
    ])
  };
  self.orders = ko.observableArray(outstandingOrders);
  self.pizzas = pizzaDimension;


  // Sammy.js used as router, available as self.orderRouter
  self.orderRouter = Sammy(function() {
    console.log("Sammy()");
    // list route
    this.get('#/list', function() {
      console.log("Window: list");
      self.currentWindow('list');
    });

    this.get('#/obrada', function() {
      console.log('route = #/obrada')
      this.app.setLocation('#/obrada/' + self.orders()[0].id);
    });

    this.get('/menu', function() {
      window.location = '/menu';
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

  self.processOrder = function (ourOrder) {
    console.log("Process order:" + ourOrder);
    // TODO: processing given order
    self.orderRouter.setLocation("#/obrada/" + ourOrder.id);
  }

  self.processNextOrder = function () {
    console.log("Process next order.");
    self.orderRouter.setLocation("#/obrada");
  }

  self.countRows = ko.computed(function() {
    console.log("Compute count of rows");
    console.log(self.orders().length + 1);
    return self.orders().length + 1;
  });

  self.pizzaPrice = function(orderLine) {
    console.log("Pizza price");
    console.log(orderLine);
    // and get the price for the size
    var pizza = $.grep(self.pizzas, function(e){ return e.name == orderLine.pizza(); })[0];
    var price = pizza[orderLine.pizzaSize()];
    return price;
  };

  // translating the pizza size for confirmation view
  self.sizeTranslate = function(orderLine) {
    console.log("sizeTranslate");
    console.log(orderLine)
    var transString = 'Whaa?';
    var pizzaSize = orderLine.pizzaSize();
    switch(pizzaSize){
      case 'small': 
        transString = 'Mala';
        break;
      case 'large':
        transString = 'Velika';
        break;
      case 'jumbo':
        transString = 'Jumbo';
        break;
    }
    return transString;
  };

  // Printing the order
  self.printOrder = function() {

    var prtContent = $('#order_detail .modal-content').clone();
    prtContent.contents().find('a').css('visibility','hidden');

    var printWindow = window.open('/printorder', '', 'left=50,top=50,width=640,height=640,toolbar=0,scrollbars=0,status=0');
    printWindow.focus();
 
    $(printWindow).load(function(){
        $(printWindow.document).contents().find('body').prepend(prtContent.html());
        printWindow.document.close();
        printWindow.print();
        // printWindow.close();
    });

  }

  // Final act of having the order processed
  self.orderProcessed = function(){
    var orderId = self.currentOrderContext.id();
    self.orders.remove(function(e){
      return e.id == orderId;
    })

    var orderData = {isProcessed: 1}

    try {
       $.post("/order/update/" + orderId, orderData).done(function(ajaxResponse){
            if (ajaxResponse.id) {
              self.orderRouter.setLocation("#/list");            
            } else {
              console.log('Post problems: ' + ajaxResponse);
              $('#init_error_window').fadeIn('fast');
            }            
          }).fail(function(){
              console.log('Post failure');
              console.log(ajaxResponse);
              $('#init_error_window').fadeIn('fast');
          });    
     } catch(err) {
        $('#init_error_window').fadeIn('fast');
        console.log('Catched!');
     }
  }

}

// --------- Helper functions

// prettyPrint for prices
var formatPrice = function(price) {
      console.log("function formatPrice()");
  return price ? price.toFixed(2).toString().replace(".",",") : "0,00";
};

var subTotal = function(currentOrder) {
  console.log("function subTotal()");
  orderLines = currentOrder.orderLines();
  console.log(orderLines);
  var subTotal = 0;
  for (var i = orderLines.length - 1; i >= 0; i--) {
      console.log(orderLines[i]);
      subTotal += viewModel.pizzaPrice(orderLines[i]);
  };
  return subTotal;
};

var zeroPadInt = function(x) {
      console.log("function zeroPadInt()");
  return ('0000000' + x).substr(-5);
}

var prettyDateTime = function (date) {
      console.log("function prettyDateTime()");
  return moment(date).fromNow(true);
}

// custom binding fadeVisible handler. Just plain eyecandy.
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
              console.log("fadeVisible.init()");
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        console.log("fadeVisible.update()" + element.toString() + valueAccessor());
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).animate({display: 'none'},200).fadeIn('fast') : $(element).fadeOut('fast');
    }
};


// initialize ViewModel


var pizzaDimension={};
var outstandingOrders=[];
var viewModel;
var hostName =  window.location.host;

// Socket handling functions
var requestOrders = function(response) {     
  // viewModel.orders.valueHasMutated();
  console.log('New observableArray from response:')

  viewModel.orders.removeAll();
  viewModel.orders(response);
  viewModel.orders.valueHasMutated();

  console.log('viewModel.orders: ', viewModel.orders);
}

var connectOrders = function (){
  socket.request('/order',{isProcessed: 0}, requestOrders);

  socket.on('message', function(message){
    console.log('Got message: ',message);
    viewModel.orders.push(message.data);
  });
}

var socket = io.connect('http://' + hostName);

$(document).ready(function(){

  try{
    // get the Pizza dimension data
    $.getJSON("/pizza/findAll").done(function(pizzaJSON){
      pizzaDimension=pizzaJSON;
      console.log("Pizza succes: " + pizzaJSON)
      try {
          // get initial set of active orders
          // $.getJSON("/order?isProcessed=0").done(function(orderJSON){
          // outstandingOrders = orderJSON;

          viewModel = new OrdersViewModel();
          ko.applyBindings(viewModel);
          socket.on('connect', connectOrders);
          // console.log("Order succes: " + orderJSON);
      } catch (err) {
        console.log("getJSON, caught exception at order: " + err)
        $('#init_error_window').fadeIn('fast');
        $('#error_window_content').append("<pre>" + err.toString() + "</pre>");
      };
    }).fail(function(data){
      console.log("getJSON fail at pizza: " + data)
      $('#init_error_window').fadeIn('fast');
      $('#error_window_content').append("<pre>" + data.toString() + "</pre>");
    });
  } catch (err) {
      console.log("getJSON caught exception at order: " + err)
      $('#init_error_window').fadeIn('fast');    
      $('#error_window_content').append("<pre>" + err.toString() + "</pre>");
  } 
});
