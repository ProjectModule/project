(function(global){
    var loginViewModel,
        app = global.app = global.app || {};
    
    loginViewModel = kendo.data.ObservableObject.extend({
        
        signupView:function()
        {
           app.apps.navigate("views/signup.html");
        }
    });
    app.login = {
        viewModel: new loginViewModel()
    };
}(window));