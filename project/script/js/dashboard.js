(function(global){
    var dashboardViewModel,
        app = global.app = global.app || {};
    
    dashboardViewModel = kendo.data.ObservableObject.extend({
        
        show:function()
        {
           app.signup.viewModel.blankSignupField();
           app.login.viewModel.blankLoginField();
        }
    });
    app.dashboard = {
        viewModel: new dashboardViewModel()
    };
}(window));