(function(global){
    var dashboardViewModel,
        app = global.app = global.app || {};
    
    dashboardViewModel = kendo.data.ObservableObject.extend({
        
        show:function(e)
        {
           app.signup.viewModel.blankSignupField();
           app.login.viewModel.blankLoginField();
        },
        Getdata:function()
        {
            try
            {

                alert(localStorage.getItem("userLoginBy"));
            }
            catch(e)
            {
                alert(e.message);
            }
        },
        myAppLogout:function()
        {
            var status = localStorage.getItem("userLoginBy");
            alert("LoginBy "+status);
            
            if(status === "fbLogin")
            {
                window.fb.myFBlogout();
            }
            else
            {
                localStorage.setItem("LoginUserName","");
                localStorage.setItem("LoginUserEmail","");
                localStorage.setItem("LoginStatus",false);
                localStorage.setItem("userLoginBy","");
                localStorage.setItem("image","");
                app.apps.navigate("views/home.html");
            }
        }
    });
    app.dashboard = {
        viewModel: new dashboardViewModel()
    };
}(window));