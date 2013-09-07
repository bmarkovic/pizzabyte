function pizza (data) {
  var self=this;
  console.log("Constructed pizza", data)
  self.name = ko.observable(data.name);
  self.imgURL = ko.observable(data.imgURL);
  self.description = ko.observable(data.description);
  self.ingredients = ko.observable(data.ingredients);
  self.small = ko.observable(data.small);
  self.large = ko.observable(data.large);
  self.jumbo = ko.observable(data.jumbo);
  self.id = ko.observable(data.id);
}

function MenuViewModel() {

  var self = this;

  self.currentWindow = ko.observable();
  self.pizzas = ko.observableArray([]);
  self.currentPizza = new pizza({
    name: '',
    imgURL: '',
    description: '',
    ingredients: '',
    small: 0.0,
    large: 0.0,
    jumbo: 0.0,
    id: -1});
  
  for (var i = pizzaJS.length - 1; i >= 0; i--) {
    self.pizzas.push(new pizza(pizzaJS[i]));
  };

  console.log("Pizza obsArr: ", self.pizzas());

  self.editCurrent = function(){};

  // Sammy.js used as router, available as self.menuRouter
  self.menuRouter = Sammy(function() {
    console.log("Sammy()");
    // list route
    this.get('#/list', function() {
      console.log("Window: list", self.pizzas);
      self.currentWindow('list');
    });

    this.get('#/add', function() {
      console.log('route = #/add');
      self.currentPizza = new pizza({
        name: '',
        imgURL: '',
        description: '',
        ingredients: '',
        small: 0.0,
        large: 0.0,
        jumbo: 0.0,
        id: -1});;

      self.currentWindow('edit');

      // this is how we look when we edit

      self.editCurrent = function(){
        console.log("Edit current", self.currentPizza)
 //       var currentJS = ko.toJS(currentPizza);
 //       delete currentJS.id;
 //       console.log("Current JS: ", currentJS)

 /*       try {
          $.post('/pizza/create', currentJS).done(function(ajaxResponse) {
            if (ajaxResponse.id) {
              console.log("All good ", ajaxResponse)
              currentJS.id = ajaxResponse.id;
              self.pizzas.push(currentJS);
            } else {
              console.log('Post problems: ', ajaxResponse);
              $('#init_error_window').fadeIn('fast');
              $('#error_window_content').appendTo('<pre>'+ ajaxResponse +'</pre>')                
            }

          }).fail(function(){
             console.log('Post failure', ajaxResponse);
             $('#init_error_window').fadeIn('fast');            
             $('#error_window_content').appendTo('<pre>'+ ajaxResponse +'</pre>')                
          });
        } catch(err) {
          console.log('Post error', err);
          $('#init_error_window').fadeIn('fast');
          $('#error_window_content').appendTo('<pre>'+ err +'</pre>')                
        }*/
      }
    }); // end add item

    // processing (numbered)
    this.get('#/edit', function() {
      self.currentWindow('edit');
      console.log("Window: ", self.currentWindow(), "  current item ", self.currentPizza);

     self.editCurrent = function(){
        console.log("Edit current", self.currentPizza)
/*        var currentJS = ko.toJS(currentPizza);
        console.log("Current JS: ", currentJS);
*/
/*        try {
          $.post('/pizza/update/' + currentJS.id, currentJS).done(function(ajaxResponse) {
            if (ajaxResponse.id) {
              console.log("All good ", ajaxResponse)
              currentJS.id = ajaxResponse.id;
              self.pizzas.push(currentJS);
            } else {
              console.log('Post problems: ', ajaxResponse);
              $('#init_error_window').fadeIn('fast');
              $('#error_window_content').appendTo('<pre>'+ ajaxResponse +'</pre>')                
            }

          }).fail(function(){
             console.log('Post failure', ajaxResponse);
             $('#init_error_window').fadeIn('fast');            
             $('#error_window_content').appendTo('<pre>'+ ajaxResponse +'</pre>')                
          });
        } catch(err) {
          console.log('Post error', err);
          $('#init_error_window').fadeIn('fast');
          $('#error_window_content').appendTo('<pre>'+ err +'</pre>')                
        }*/
      }

    }); // end get edit item

    this.get('/bo', function() {
      window.location = '/bo';
    });    

    // set list as default route
    this.get('', function() {
      console.log("Adressed root route.");
      this.app.runRoute('get', '#/list');
    });
  
  }).run(); // run Sammy, run!

  self.addNew = function () {
    console.log("Process next order.");
    self.menuRouter.setLocation("#/add");
  }

  self.editPizza = function (data) {
    console.log("Process pizza.", data);
    self.currentPizza = data;
    self.menuRouter.setLocation("#/edit");
  }

}

formatPrice = function(price) {
  return price ? price.toFixed(2).toString().replace(".",",") : "0,00";
};

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

var hostName =  window.location.host;
var socket = io.connect('http://' + hostName);

var viewModel;
var pizzaJS=[];

$(document).ready(function(){
  console.log("Document ready!")
  $.getJSON("/pizza").done(function(data){

    pizzaJS=data;
    console.log("Done:", pizzaJS)
    viewModel = new MenuViewModel();
    ko.applyBindings(viewModel);

  }).fail(function(data){
    console.log("Fail", data)
    // $('#init_error_window').fadeIn('fast');
  });
});
