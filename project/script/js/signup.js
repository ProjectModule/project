(function(global){
    var signupViewModel,
        app = global.app = global.app || {};
    
    signupViewModel = kendo.data.ObservableObject.extend({
        
        firstname:'',
        lastname:'',
        email:'',
        password:'',
        mbnumber:'',
        gender_male:'Male',
        gender_female:'Female',
        occupation:'0',
        state:'',
        address:'',
        name:"",
        show:function()
        {   
            /* Load state data to the dropdownlist*/
            var dataS = new kendo.data.DataSource({
                data:["Assam","Jammu and Kashmir","Maharashtra","Uttar Pradesh","Gujarat","Andhra Pradesh","Karnataka","Kerala","West Bengal","Tripura","Chhattisgarh","Punjab","Mizoram","Rajasthan","Goa","Uttarakhand","Arunachal Pradesh","Bihar","Lakshadweep","Jharkhand","Dadra and Nagar Haveli","Orissa","Tamil Nadu","Himachal Pradesh","Haryana","Madhya Pradesh","Delhi","Chandigarh","Daman and Diu","Nagaland","Sikkim","Manipur","Meghalaya","Pondicherry","Jammu & Kashmir","Andaman and Nicobar Islands"]
            });
            dataS.fetch(function(){
                var data = this.data();
                app.signup.viewModel.setComboBoxData(data);
            });
            
            
            /*set radio button functionality*/
            $("select > option[value='3']").css("display","none");
            
            $("#signup_female").change(function(){
                $('select option[value="0"]').attr('selected',true);
                $("select > option[value='3']").css("display","block");
            });
            
            $("#signup_male").change(function(){
                $('select option[value="0"]').attr('selected',true);
                $("select > option[value='3']").css("display","none");
            });
            
            /*Blank the signup field*/
            app.signup.viewModel.blankSignupField();
        },
        
        setComboBoxData:function(data)
        {
            $("#statecombobox").kendoDropDownList({
               dataSource:data,
               optionLabel: "Select State"
            });
        },
        
        validation:function()
        {
            var that = this;
            
            var sfname = that.get("firstname"),
                slname = that.get("lastname"),
                semail = that.get("email"),
                spassword = that.get("password"),
                smbnumber = that.get("mbnumber"),
                soccupation = that.get("occupation"),
                sState = that.get("state"),
                saddress = that.get("address"),
                genderMale = that.get("gender_male"),
                genderFemale = that.get("gender_female");
            
            var emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            var charReg = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;
            
            /*if(sfname === "")
            {
                navigator.notification.alert("Please enter First name",function(){},"Notification","OK");
                $('#signup_fname').focus();
                return;
            }
            
            if(slname === "")
            {
                navigator.notification.alert("Please enter Last name",function(){},"Notification","OK");
                $('#signup_lname').focus();
                return;
            }*/
            
            /*if(charReg.test(sfname) || charReg.test(slname))
            {
                navigator.notification.alert("special character not enter in textfield",function(){},"Notification","OK");
                return;
            }*/
            
            /*if(semail === "")
            {
                navigator.notification.alert("Please enter Email Address",function(){},"Notification","OK");
                $('#signup_email').focus();
                return;
            }
            
            if (!emailReg.test(semail))
            {
                navigator.notification.alert('Please enter a valid email address.');
                $('#signup_email').focus();
                return;
            }
            
            if(spassword === "")
            {
                navigator.notification.alert("Please enter Password",function(){},"Notification","OK");
                $('#signup_pwd').focus();
                return;
            }
            
            if(smbnumber === "")
            {
                navigator.notification.alert("Please enter Mobile Number",function(){},"Notification","OK");
                $('#signup_mbnumber').focus();
                return;
            }
            
            if(smbnumber.toString().length!==10)
            {
                navigator.notification.alert("Mobile number should be enter 10 digit",function(){},"Notification","OK");
                $('#signup_mbnumber').focus();
                return;
            }
            
            if($('input[type="radio"]:checked').val() === undefined)
            {
                 navigator.notification.alert("Please select gender",function(){},"Notification","OK");
                 return;
            }
            
            if(soccupation === "0")
            {
                navigator.notification.alert("Please select your Occupation",function(){},"Notification","OK");
                $('#myselect').focus();
                return;
            }
            
            if($('#statecombobox').data("kendoDropDownList").value() === "Select State")
            {
                navigator.notification.alert("Please select your State",function(){},"Notification","OK");
                $('#statecombobox').focus();
                return;
            }
            
            if(saddress === "")
            {
                navigator.notification.alert("Please enter your Address",function(){},"Notification","OK");
                $('#addressDtl').focus();
                return;
            }*/
            
            if(!app.checkConnection())
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
                var dataParam=[];
                name = sfname+" "+slname;
                that.set("name",name);
                dataParam['name'] = name;
                dataParam['email'] = semail;
                dataParam['password'] = spassword;
                dataParam['mobile'] = smbnumber;
                dataParam['occupation'] = soccupation;
                dataParam['state'] = sState;
                dataParam['address'] = saddress;
                
                if($('input[type="radio"]:checked').val() === 'Male')
                {
                    dataParam['gender'] = genderMale;
                }
                else
                {
                    dataParam['gender'] = genderFemale;
                }
                app.inserData(dataParam);
            }
        },
        
        blankSignupField:function()
        {
            $('#signup_fname').val("");
            $('#signup_lname').val("");
            $('#signup_email').val("");
            $('#signup_pwd').val("");
            $('#signup_mbnumber').val("");
            $('#myselect').val("0");
            $('#addressDtl').val("");
           // $('#statecombobox').data("kendoDropDownList").value("Select State");
            if($('input[type="radio"]:checked').val() !== undefined)
            {
                $('#signup_male').prop("checked",false);
                $('#signup_female').prop("checked",false);
            }
        },

        
        byCamera:function()
        {
            alert("hgjhgj");
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType : Camera.PictureSourceType.CAMERA 
            });
            

            function onSuccess(imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
        }
    });
    app.signup = {
        viewModel:new signupViewModel()
    };
}(window));