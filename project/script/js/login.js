(function(global){
    var loginViewModel,
        app = global.app = global.app || {};
    
    loginViewModel = kendo.data.ObservableObject.extend({
        
        lname:'',
        lpwd:'',
        signupView:function()
        {
           app.apps.navigate("views/signup.html");
        },
        
        loginValidation:function(e)
        {
            var that = this,
                lusername = that.get("lname"),
                lpassword = that.get("lpwd");
            
            if(!window.connection.checkConnection())
            {
                navigator.notification.confirm("Internet is not available",function(confirm){
                    if(confirm === true || confirm === 1)
                    {
                        app.signup.viewModel.validation();
                    }
                },"Connection Error","Retry,Cancel")
            }
            else
            {
                if(lusername === "")
                {
                    navigator.notification.alert("Please enter Username",function(){},"Notification","OK");
                    $('#login_name').focus();
                    return;
                }

                if(lpassword === "")
                {
                    navigator.notification.alert("Please enter Password",function(){},"Notification","OK");
                    $('#login_pwd').focus();
                    return;
                }
                
                if(lusername !== "" && lpassword !== "")
                {
                    var dataParam={};
                    dataParam['username'] = lusername;
                    dataParam['password'] = lpassword;
                    window.myDB.readData(dataParam);
                }
            }
        },
        
        blankLoginField : function()
        {
            $('#login_name').val("");
            $('#login_pwd').val("");
        },
        
        facebookLogin:function(e)
        {
            window.fb.login(e.button.data().id);
        },
        
        twitterLogin:function()
        {
            alert("twitter");
        }
    });
    app.login = {
        viewModel: new loginViewModel()
    };
}(window));