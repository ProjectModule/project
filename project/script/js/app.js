var app = (function(win){
    "use strict";
    
    var db;
    var onDeviceReady = function()
    {
        checkConnection();
        createDB();
        
    }; 
    
    /* create database */
    var createDB = function()
    {
        console.log(window.device);
        
        if(device.platform === "Android")
        {
            if(window.sqlitePlugin !== undefined)
            {
                alert("sqlite plugins in Android Phone");
                db = window.sqlitePlugin.openDatabase("SQLDB");
                createTable();
            }
            else
            {
                alert("webSql in Android Phone");
                db = window.openDatabase("SQLDB","1.1","Hybrid Database",1000000);
                createTable();
            }
        }
        else
        {
            if(window.sqlitePlugin !== undefined)
            {
                alert("sqlite plugins in window phone");
                db = window.sqlitePlugin.openDatabase("SQLDB");
                createTable();
            }
        }
    };
    
    /* create table */
    var createTable = function()
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
    };
    
    /* Insert data */
    var inserData = function(data)
    {
        app.apps.showLoading();
        try
        {
            db.transaction(function(tx){
                var nowDate = new Date();
                tx.executeSql("insert into userinfo(image,name,email,password,mobile_number,gender,occupation,state,address,date) values(?,?,?,?,?,?,?,?,?,?)",[data['image'],data['name'],data['email'],data['password'],data['mobile'],data['gender'],data['occupation'],data['state'],data['address'],nowDate],onSuccess,onFailure);
            });
        }
        catch(e)
        {
            navigator.notification.alert(e.message,function(){},"Notification","OK");
        }
    };
    
    var onSuccess = function(tx,r)
    {
        var username = $('#signup_fname').val()+" "+$('#signup_lname').val();
        var useremail = $('#signup_email').val();
        
        localStorage.setItem("LoginUserName",username);
        localStorage.setItem("LoginUserEmail",useremail);
        localStorage.setItem("LoginStatus",true);
        
        setTimeout(function(){ 
            app.apps.navigate("views/dashboard.html");
            app.apps.hideLoading();
        }, 2000);
    };
    
    var onFailure = function(tx,e)
    {
        setTimeout(function(){ 
            app.apps.hideLoading();
            
            if(device.platform === "Android")
            {
                if(e.message === "column email is not unique")
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
        
    };
    
    /* fetch data */
    var readData = function(data)
    {
        app.apps.showLoading();
        try
        {
            db.transaction(function(tx){
                tx.executeSql("select * from userinfo where email=? and password=?",[data['username'],data['password']],readSuccess,readFailure);
            });
        }
        catch(e)
        {
           navigator.notification.alert("Email Id used by another User",function(){},"Notification","OK"); 
        }
    };
    
    var readSuccess = function(tx,results)
    {
        if(results.rows.length === 1)
        {
            setTimeout(function(){ 
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
    };
    
    var readFailure = function(tx,e)
    {
        console.log("Fetch Sqlite Error : "+e.message);
    };
    
    /* check interne connection available or not */
    var checkConnection = function()
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
    };
    
    
    document.addEventListener("deviceready",onDeviceReady,false);
    
    var mobileApp = new kendo.mobile.Application(document.body,{skin:"flat",initial:""});
    return{
        apps:mobileApp,
        checkConnection:checkConnection,
        inserData:inserData,
        readData:readData
    };
}(window));