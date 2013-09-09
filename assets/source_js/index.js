// ----------- Model and fixtures

// OrderLine - main model
function orderLine(pizzaSize, orderedPizza) {
    var self = this;
    self.pizzaSize = ko.observable(pizzaSize);
    self.pizza = ko.observable(orderedPizza);
}

$(document).keyup(function(e) {

  if (e.keyCode == 27) {
    console.log("ESC keypress detected");
    showPizzaMenu = viewModel.showPizzaMenu();
    console.log("showPizzaMenu = " + showPizzaMenu);
    if (showPizzaMenu == true) {
      window.history.go(-1);
    }
  }   // esc
});


//  ---------- ViewModel

function PizzaViewModel() {

  var self = this;

  // inital housecleaning.
  self.currentPath = ko.observable();
  self.showPizzaMenu = ko.observable(false);
  self.initError = false;

  // outer model data
  self.userName = ko.observable('');
  self.userAddress = ko.observable('');
  self.userPhone = ko.observable('');
  self.userNote = ko.observable('');
  self.pizzas = pizzaDimension;
  self.currentOrderContext = ko.observable();

  // Sammy.js used as router, available as self.pizzaRouter
  self.pizzaRouter = Sammy(function() {
    // intro route
    this.get('#/intro', function() {
      self.currentPath('intro');
      self.showPizzaMenu(false);
    });

    // order route (step 1)
    this.get('#/start', function() {
      self.currentPath('start');
      self.showPizzaMenu(false);
    });

    this.get('#/pizza', function() {
      self.currentPath('start');
      self.showPizzaMenu(true);
    });

    this.get('#/potvrda', function() {
      self.currentPath('potvrda');
      self.showPizzaMenu(false);
    });

    // set intro as default route
    this.get('', function() {
      this.app.runRoute('get', '#/intro');
    });
   
  }).run();

  // init the order model with one default line
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

  self.showOrderLine = function(elem) { 
    if (elem.nodeType === 1) {
      console.log('Show element:\n' + elem);
      $(elem).hide().fadeIn();
    }
  };

  self.hideOrderLine = function(elem) { 
    if (elem.nodeType === 1) {
      console.log('Hide element:\n' + elem);
      $(elem).fadeOut(function() { 
        $(elem).remove(); 
      })
    } 
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
    self.pizzaRouter.setLocation('#/start');
  }

  // store current order line in temp context store
  // and trigger modal dialog
  self.menuPizza = function(orderLine) {
    self.currentOrderContext=orderLine;
    self.pizzaRouter.setLocation('#/pizza')
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

  // translating the pizza size for confirmation view
  self.sizeTranslate = function(orderLine) {
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
       $.post('/order/create', orderData).done(function(ajaxResponse) {
            if (ajaxResponse.id) {
               
               orderId = ajaxResponse.id;
               console.log("All good.", ajaxResponse);
               console.log('Order ID: ', orderId);

               for (var i = orderJS.length - 1; i >= 0; i--) {
                 orderLineJS = {
                  order: orderId,
                  pizza: orderJS[i].pizza.name,
                  pizzaSize: orderJS[i].pizzaSize
                  };
                 try {
                   $.post("/orderline/create", orderLineJS).done(function(ajaxResponse){
                        if (ajaxResponse.id) {
                          console.log("All good.", ajaxResponse);
                          window.location = '/congrats';
                        } else {
                          console.log('Post problems: ', ajaxResponse);
                          $('#init_error_window').fadeIn('fast');
                        }            
                      }).fail(function(){
                          console.log('Post failure', ajaxResponse);
                          $('#init_error_window').fadeIn('fast');
                      });    
                 } catch(err) {
                    $('#init_error_window').fadeIn('fast');
                    console.log('Catched!', err);
                 }
                }

            } else {
              console.log('Post problems: ', ajaxResponse);
              $('#init_error_window').fadeIn('fast');
              $('#error_window_content').appendTo('<pre>'+ ajaxResponse +'</pre>');
            }
         }).fail(function(){
              console.log('Post failure', ajaxResponse);
              $('#init_error_window').fadeIn('fast');
          });              
     } catch(err) {
        $('#init_error_window').fadeIn('fast');
        console.log('Catched!' + err.toString());
        console.log(err);
     }

  };
}

// --------- Helper functions

// prettyPrint for prices
formatPrice = function(price) {
  return price ? price.toFixed(2).toString().replace(".",",") : "0,00";
};

// custom binding fadeVisible handler. Just plain eyecandy.
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or ou
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).animate({display: 'none'},200).fadeIn('fast') : $(element).fadeOut('fast');
    }
};
var hostName =  window.location.host;
var socket = io.connect('http://' + hostName);

var viewModel;
var pizzaDimension={};

// initialize ViewModel
$(document).ready(function(){
  $.getJSON("/pizza/findAll").done(function(data){
    pizzaDimension=data;
    try {
      viewModel = new PizzaViewModel();
      ko.applyBindings(viewModel);
    } catch (err) {
      $('#init_error_window').fadeIn('fast');
    };
  }).fail(function(){
    $('#init_error_window').fadeIn('fast');
  });


});
