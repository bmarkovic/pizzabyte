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
  self.currentOrderContext = ko.observable({
    id: 0,
    userNaem: '',
    userAddress: '',
    userPhone: '',
    userNote: '',
    orderLines: [
     {
        pizza: 'Pita',
        pizzaSize: "Vel'ka"
     }
    ] 
  });
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

    // order processing (numbered order)
    this.get('#/obrada/:order', function() {
      self.currentWindow('obrada');
      // self.currentOrderContext(this.params.order);
      console.log("Window: " + self.currentWindow() + "  currentOrder " + this.params.order);
    });

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
    // and get the price for the size
    // return orderLine.pizza()[orderLine.pizzaSize()];
    return 0;
  };

  // translating the pizza size for confirmation view
  self.sizeTranslate = function(orderLine) {
    console.log("sizeTranslate");
    var transString = 'Whaa?';
    // var pizzaSize = orderLine.pizzaSize();
    // switch(pizzaSize){
    //   case 'small': 
    //     transString = 'Mala';
    //     break;
    //   case 'large':
    //     transString = 'Velika';
    //     break;
    //   case 'jumbo':
    //     transString = 'Jumbo';
    //     break;
    // }
    return transString;
  };

/*  // init the order model with one default line
  self.order = ko.observableArray([
    new orderLine ('large', self.pizzas[0]),
  ]);
  
  // push new default object into order model
  self.addPizza = function() {
        this.order.push(
          new orderLine ('large', self.pizzas[0])
        );
  };
  
  // remove the selected order line
  self.killPizza = function(orderLine) {
    self.order.remove(orderLine);
  };
  
  // return price for order line
  self.pizzaPrice = function(orderLine) {
    // and get the price for the size
    return orderLine.pizza()[orderLine.pizzaSize()];
  };

  // pizza selected from modal dialog
  // change pizza object  within our stored context
  self.pizzaSelected = function(selectedPizza) {
    self.currentOrderContext.pizza(selectedPizza);
    self.orderRouter.setLocation('#/start');
  }

  // store current order line in temp context store
  // and trigger modal dialog
  self.menuPizza = function(orderLine) {
    self.currentOrderContext=orderLine;
    self.orderRouter.setLocation('#/pizza')
  }

  // calculate subtotal of order
  self.subTotal = function(orderKO) {
    order = ko.toJS(orderKO);
    var sumTotal = 0;
    for (var i=0; i < order.length; i++) {
      sumTotal += order[i].pizza[order[i].pizzaSize];
    }
    return sumTotal;
  };


  self.finalizeOrder = function() {
 //    console.log("You've crossed the finnish line!");

     // serialize data

     // simplify order, we will consider pizza nime as
     // unique identifier of pizza
     var orderLineJS = {};
     var orderJS = ko.toJS(self.order);
     var orderId = 0;

     var orderData = {
        userName: ko.utils.unwrapObservable(self.userName),
        userAddress: ko.utils.unwrapObservable(self.userAddress),
        userPhone: ko.utils.unwrapObservable(self.userPhone),
        userNote: ko.utils.unwrapObservable(self.userNote),
        isProcessed: 0
     }

//     console.log(orderData);
     
     try {
       $.post("/order/create", orderData).done(function(ajaxResponse){
            if (ajaxResponse.id) {
               
               orderId = ajaxResponse.id;
               console.log("All good.");
               console.log(ajaxResponse);
               console.log('Order ID: ' + orderId);

               for (var i = orderJS.length - 1; i >= 0; i--) {
                 orderLineJS = {
                  order: orderId,
                  pizza: orderJS[i].pizza.name,
                  pizzaSize: orderJS[i].pizzaSize
                  };
                 try {
                   $.post("/orderline/create", orderLineJS).done(function(ajaxResponse){
                        if (ajaxResponse.id) {
                          console.log("All good.");
                          console.log(ajaxResponse);
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
                };

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
     // fill simpler serialized object not to send back
     // all the pizza dimension data that is in our
     // orderSO object now




     // window.location = "/congrats.html";  
  };
*/

}

// --------- Helper functions

// prettyPrint for prices
var formatPrice = function(price) {
      console.log("function formatPrice()");
  return price ? price.toFixed(2).toString().replace(".",",") : "0,00";
};

var subTotal = function(currentOrder) {
      console.log("function subTotal()");
  return 0;
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

var pizzaDimension={};
var outstandingOrders={};
var viewModel;

// initialize ViewModel
$(document).ready(function(){

  try{
    // get the Pizza dimension data
    $.getJSON("/pizza/findAll").done(function(pizzaJSON){
      pizzaDimension=pizzaJSON;
      console.log("Pizza succes: " + pizzaJSON)
      try {
        // get initial set of active orders
        $.getJSON("/order?isProcessed=0").done(function(orderJSON){
          outstandingOrders = orderJSON;
          console.log("Order succes: " + orderJSON);

          viewModel = new OrdersViewModel();
          ko.applyBindings(viewModel);

        }).fail(function(data){
           console.log("getJSON fail at order: " + data)
           $('#init_error_window').fadeIn('fast');
           $('#error_window_content').append("<pre>" + data.toString() + "</pre>");
        });
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
