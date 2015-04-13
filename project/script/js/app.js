var app = (function(win){
    "use strict";
    
    var db,mobileApp;
    var onDeviceReady = function()
    {
        window.fb = new facebookConnect();
        window.fb.run();
        
        window.connection = new connectionCheck();
        window.connection.checkConnection();
        
        window.myDB = new myDataBase();
        window.myDB.createDB();
        
        window.cam = new cameraFunction();
        
    }; 
    
    function facebookConnect(){}
    facebookConnect.prototype = {
        run:function()
        {
           try
            {
                FB.init({
                    appId: "828834967202957",
                    status:"false",
                    nativeInterface: CDV.FB,
                    useCachedDialogs: false
                });
            }
            catch(ex)
            {
               alert(ex.message); 
            }
        },
        
        loginStatus:function()
        {
            try
            {
                FB.getLoginStatus(function(response){
                
                    if(response.status === "connected")
                    {
                        alert("login");
                    }
                    else
                    {
                        alert("You are not logged in");
                    }
                });
            }
            catch(ex)
            {
                alert(ex.message);
            }
        },
        
        getLoginApi:function()
        {
            try
            {
                var dParam = [];
                FB.api('/me', function(response) {
                    alert(JSON.stringify(response));
                    dParam['FBid'] = response.id;
                    dParam['FBlink'] = response.link;
                    dParam['FBemail'] = response.email;
                    dParam['FBgender'] = response.gender;
                    dParam['FBname'] = response.name;
                    localStorage.setItem("FBid",dParam['FBid']);
                    localStorage.setItem("FBlink",dParam['FBlink']);
                    localStorage.setItem("FBemail",dParam['FBemail']);
                    localStorage.setItem("FBgender",dParam['FBgender']);
                    localStorage.setItem("FBname",dParam['FBname']);
                    alert("id : "+localStorage.getItem('id'));
            alert("link : "+localStorage.getItem('link'));
            alert("name : "+localStorage.getItem('name'));
            alert("email : "+localStorage.getItem('email'));
            alert("gender : "+localStorage.getItem('gender'));
                });
            }
            catch(ex)
            {
                alert(ex.message);
            }

        },
        
        login:function(data)
        {
            try
            { 
                FB.login(function(response){
                    if (response.authResponse)
                    {
                        FB.api('/me', function(response) {
                            localStorage.setItem("FBid",response.id);
                            localStorage.setItem("FBlink",response.link);
                            localStorage.setItem("FBemail",response.email);
                            localStorage.setItem("FBgender",response.gender);
                            localStorage.setItem("FBname",response.name);
                        });
                        localStorage.setItem("userLoginBy",data);
                        localStorage.setItem("myLoginStatus",true);
                        app.apps.navigate("views/dashboard.html");
                    }
                },{scope:'email,user_likes'});
            }
            catch(ex)
            {
                alert(ex.message);
            }
        },
        
        myFBlogout:function()
        { 
            try
            {
                localStorage.setItem("myLoginStatus",false);
                localStorage.setItem("FBid","");
                localStorage.setItem("FBlink","");
                localStorage.setItem("FBemail","");
                localStorage.setItem("FBgender","");
                localStorage.setItem("FBname","");
                
                FB.logout(function(response){
                   app.apps.navigate("views/home.html");
                });
                
            }
            catch(ex)
            {
                alert(ex.message);
            }
        }
    }
    
    
    function connectionCheck(){}
    connectionCheck.prototype = {
        checkConnection:function()
        {
            if(typeof navigator.connection.type !== "undefined")
            {
                var networkStatus = navigator.connection.type;

                var states={};
                states[Connection.UNKNOWN] = "Unknown connection";
                states[Connection.ETHERNET] = "ETHERNET connection";
                states[Connection.WIFI] = "WIFI connection";
                states[Connection.CELL_2G] = "CELL_2G connection";
                states[Connection.CELL_3G] = "CELL_3G connection";
                states[Connection.CELL_4G] = "CELL_4G connection";
                states[Connection.CELL] = "CELL connection";
                states[Connection.NONE] = "no network connection";

                if(states[networkStatus] === "no network connection")
                {
                    return false;
                }
            }
            return true;
        }
    }
    
    function myDataBase(){}
    myDataBase.prototype = {
        createDB:function()
        {
            var that = this;
            
            if(device.platform === "Android")
            {
                if(window.sqlitePlugin !== undefined)
                {
                   // alert("sqlite plugins in Android Phone");
                    db = window.sqlitePlugin.openDatabase("SQLDB");
                    that.createTable();
                }
                else
                {
                    //alert("webSql in Android Phone");
                    db = window.openDatabase("SQLDB","1.1","Hybrid Database",1000000);
                    that.createTable();
                }
            }
            else
            {
                if(window.sqlitePlugin !== undefined)
                {
                    alert("sqlite plugins in window phone");
                    db = window.sqlitePlugin.openDatabase("SQLDB");
                    that.createTable();
                }
            }
        },
        createTable:function()
        {
            try
            {
                db.transaction(function(tx){
                    tx.executeSql("CREATE TABLE IF NOT EXISTS userinfo(id INTEGER PRIMARY KEY ASC,image text,name TEXT,email TEXT UNIQUE,password TEXT,mobile_number INTEGER,gender TEXT,occupation TEXT,state TEXT,address TEXT,date DATETIME)",[]);
                });
            }
            catch(e)
            {
                navigator.notification.alert(e.message,function(){},"Notification","OK");
            }
        },
        inserData:function(data)
        {
            var that = this;
            console.log(data);
            app.apps.showLoading();
            try
            {
                db.transaction(function(tx){
                    var nowDate = new Date();
                    tx.executeSql("insert into userinfo(image,name,email,password,mobile_number,gender,occupation,state,address,date) values(?,?,?,?,?,?,?,?,?,?)",[data['image'],data['name'],data['email'],data['password'],data['mobile'],data['gender'],data['occupation'],data['state'],data['address'],nowDate],that.inserDataSuccess,that.inserDataFailure);
                });
            }
            catch(e)
            {
                navigator.notification.alert(e.message,function(){},"Notification","OK");
            }
        },
        inserDataSuccess : function(tx,r)
        {
            var username = $('#signup_fname').val()+" "+$('#signup_lname').val();
            var useremail = $('#signup_email').val();

            localStorage.setItem("LoginUserName",username);
            localStorage.setItem("LoginUserEmail",useremail);
            localStorage.setItem("myLoginStatus",true);
            localStorage.setItem('userLoginBy','sysLogin');

            setTimeout(function(){ 
                app.apps.navigate("views/dashboard.html");
                app.apps.hideLoading();
            }, 2000);
        },
        inserDataFailure : function(tx,e)
        {
            setTimeout(function(){ 
                app.apps.hideLoading();

                if (window.navigator.simulator === true)
                {
                    if(e.message === "could not execute statement due to a constaint failure (19 constraint failed)")
                    {
                        navigator.notification.alert("Email Id used by another User",function(){},"Notification","OK");
                    }
                }
                else if(device.platform === "Android")
                {
                    if(e.message === "column email is not unique (code 19)")
                    {
                        navigator.notification.alert("Email Id used by another User",function(){},"Notification","OK");
                    }
                }
                else
                {
                    if(e.message === "Constraint")
                    {
                        navigator.notification.alert("Email Id used by another User",function(){},"Notification","OK");
                    } 
                }
            },2000);
        },
        readData:function(data)
        {
            var that = this;
            app.apps.showLoading();
            try
            {
                db.transaction(function(tx){
                    tx.executeSql("select * from userinfo where email=? and password=?",[data['username'],data['password']],that.readDataSuccess,that.readDataFailure);
                });
            }
            catch(e)
            {
               navigator.notification.alert("Email Id used by another User",function(){},"Notification","OK"); 
            }
        },
        readDataSuccess:function(tx,results)
        {
            if(results.rows.length === 1)
            {
                setTimeout(function(){ 
                    localStorage.setItem('userLoginBy','sysLogin');
                    app.apps.navigate("views/dashboard.html");
                    app.apps.hideLoading();
                }, 2000);
            }
            else
            {
                setTimeout(function(){ 
                    navigator.notification.alert("Username and Password not match",function(){},"Login Failed","OK");
                    app.apps.hideLoading();
                }, 2000);
                
            }
        },
        readDataFailure:function(tx,e)
        {
            navigator.notification.alert("Fetch Sqlite Error : "+e.message,function(){},"Login Failed","OK");
        }
        
    }
    
    
    function cameraFunction(){}
    cameraFunction.prototype = {
        
        camera:function()
        {
            var that = this;
            try
            {
                navigator.camera.getPicture(that.cameraSuccess,that.cameraError,{
                    quality:50,
                    destinationType:Camera.DestinationType.DATA_URL,
                    sourceType:Camera.PictureSourceType.CAMERA,
                    encodingType:Camera.EncodingType.JPEG
                });
            }
            catch(e)
            {
                alert(e.message);
            }
        },
        
        cameraSuccess:function(imageData)
        {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
            localStorage.setItem("image",imageData);
        },
        
        cameraError:function(message)
        {
            navigator.notification.alert("Camera Capture "+message,function(){},"Image/Upload Failed","OK");
        },
        
        gallery:function()
        {
            var that = this;
            try
            {
                navigator.camera.getPicture(that.gallerySuccess,that.galleryError,{
                quality:50,
                destinationType:Camera.DestinationType.DATA_URL,
                sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType:Camera.EncodingType.JPEG
                });
            }
            catch(e)
            {
                alert(e.message);
            }
        },
        
        gallerySuccess:function(imageData)
        {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
            localStorage.setItem("image",imageData);
        },
        
        galleryError:function(messsage)
        {
            navigator.notification.alert("Gallery "+messsage,function(){},"Image/Upload Failed","OK");
        }
    }
    
    document.addEventListener("deviceready",onDeviceReady,false);
    
    if(localStorage.getItem('myLoginStatus') === "true")
    {
        mobileApp = new kendo.mobile.Application(document.body,{skin:"flat",initial:"views/dashboard.html"});
    }
    else
    {
        mobileApp = new kendo.mobile.Application(document.body,{skin:"flat",initial:"views/home.html"});
    }
    
    return{
        apps:mobileApp
    };
}(window));