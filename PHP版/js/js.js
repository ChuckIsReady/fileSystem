
var AjaxStr=function(doname,getStr){
        url = "server.php?inAjax=1&do=";
        url += doname + getStr; 
        return url;
    };  

var authenticate = function(userName,passWord){
	var url = AjaxStr("login","")
    var data = {username:userName,password:passWord};
    var result = "";
    $.ajax({
        url: url,
        async: false,//改为同步方式
        type: "POST",
        data: data,
        success: function (res) {
            result = res;
        }
    });
    return (JSON.parse(result)).msg;
}
var login = function(){
	
	var $userName = $("#loginUserName");
	var $passWord = $("#loginPassWord");
	var $loginState = $("#loginState");
	if(authenticate($userName.val(),$passWord.val())==1){
		$loginState.html("");
		$passWord.parent().removeClass("am-form-error");
		$userName.parent().removeClass("am-form-error");
		window.location.href = "FileSystem.html";
	}	
	else {
		$loginState.html("用户名或密码错误！");
		$passWord.parent().addClass("am-form-error");
		$userName.parent().addClass("am-form-error");
	}
}

var register = function(){
	var $userName = $("#regUserName");
	var $passWord = $("#regPassWord");
	var $userNameVal = $userName.val();
	var $regState = $("#regState");
	if ($userName.val().replace(/(^\s*)|(\s*$)/g, "").length ==0) {
		//用户名为空或名字后含有空白符号(空白符会被删去)的情况
		$regState.html("名字不能为空！")
		$userName.parent().addClass("am-form-error");
		$userName.focus();
		return false;
	}	
	var url = AjaxStr("register","");
    var data = {"userName":$userNameVal,"passWord":$passWord.val()};
    $.ajax({
        url: url,
        async: false,//改为同步方式
        type: "POST",
        data: data,
        success: function (res) {
            result = res;
        }
    });
    result = (JSON.parse(result)).msg;
    switch(result){
    	case 1:
    		$regState.html($userNameVal+"注册成功");
    		$regState.parent().removeClass("am-form-error").addClass("am-form-success");
    		$userName.parent().removeClass("am-form-error");
    		$("#loginUserName").focus();
    		break;
    	case 2:
    		$regState.html("名字不能为空！")
			$userName.parent().addClass("am-form-error");
			$userName.focus();
    		break;
    	case 3:
    		$regState.parent().addClass("am-form-error");
		 	$regState.html("用户已经存在！")
		 	$userName.parent().addClass("am-form-error");
		 	$userName.focus();
    		break;
    }

	
	
}

var loginOut = function(){
		var url = AjaxStr("loginOut","");
	    var data = "";
	    $.ajax({
	        url: url,
	        async: false,//改为同步方式
	        type: "GET",
	        data: data,
	        success: function (res) {
	            result = res;
	        }
	    });
	    result = (JSON.parse(result)).msg;
	    if(result==1)
		window.location.href = "index.html";
}



var delFactorByVal = function(arr,value){
	var  len = arr.length;
	for(var i = 0;i<len;i++){
		if (arr[i] === value) 
			 arr.splice(i,1);
	}
}


//以上为数据操作


var freshUserInformation =function(){

	var url = AjaxStr("freshUserInformation","");
	var data = "";
    $.getJSON(url,data,function(res){
    	$("#storgeInformation .am-progress-bar").css("width",(res.hasStorage/res.storageMAX)*100+"%");
		$("#storgeInformation span").html(res.hasStorage+"/"+res.storageMAX);
		$("#userName span").html(" "+res.name);
    });
	
}

var editFileDom={
	dom:$('#editPopUp'),
	fileName : $("#editPopUp h4"),
	fileInner : $("#editPopUp textarea"),
	delConfirmMSG: $("#delConfirm am-modal-bd")
};

 var globelTempFile ={};
var addView = function(fileID,fileName,fileOwner,fileType,fileCreateTime,isLocked){
	var s1 = "<tr><td><input type=checkbox value="+fileID+"></td> <td class=fileName>";
	if(fileType==1){
		s1+="<i class='am-icon-folder colorFolder'></i>"+fileName+"</td> <td class=fileOwner>"+fileOwner+"</td> <td class=fileType>"+"文件夹"
	}
	else
	{
		s1+="<i class='am-icon-file-word-o colorTXT'></i>"+fileName+"</td> <td class=fileOwner>"+fileOwner+"</td> <td class=fileType>"+"文件"
	}
	s1+="</td><td class=fileCreateTime>"+fileCreateTime+"</td>";
	
	if(isLocked=="1"){
		s1+="</td><td class=lockIcon ><i class='am-icon-lock colorLock'></i></td></tr>";

	}
	else {
		s1+="</td><td class=lockIcon ><i class='am-icon-unlock colorUnlock'></i></td></tr>";

	}
	$("#fileTable").append(s1);
	
}


var add = function(fileID,fileName,fileType,fileCreateTime){
	var getstr = "&fileID="+fileID+"&fileName="+fileName+"&fileType="+fileType+
            "&fileCreateTime="+fileCreateTime;
	var url = AjaxStr("adddate",getstr);
	var data = "";
    $.getJSON(url,data,function(res){
    	switch (res.msg)
    		{
    			case 0: $("#alertRepeat").modal('open');break;
    			case 1: addView(fileID,fileName,res.fileOwner,fileType,fileCreateTime,0);freshUserInformation();break;
    			case 2: $("#alertEmpty").modal('open');break;
    			case 3: $("#alertBan").modal('open');return false;
    			default:alert("创建出现不可预料的错误！");break;
    		}
    });
	
}

var lockUnlock  = function(){
	//不做递归锁
	var result = "";
	$("tbody input:checked").each(function(){
		var $val = $(this).val();
		var getstr = "&fileID="+$val;
		var url = AjaxStr("lockUnlock",getstr);
	    var data = "";
	    $.ajax({
	        url: url,
	        async: false,//改为同步方式
	        type: "GET",
	        data: data,
	        success: function (res) {
	            result = res;
	        }
	    });
	    if(result!= 0)
	    	result = (JSON.parse(result)).msg;
	});
	switch(result){
			case 1 :showCurFolder();break;
			case 0 :$("#alertBan").modal('open');showCurFolder();break;
	}
}


var del = function(){
	var r =0;
	$("tbody input:checked").each(function(){
		var $val = $(this).val();
		//进入框架的prompt之后局部变量会异变，需要借助全局变量
		var $item = $(this).parent().parent();
		var data = "";
		if(!isFolder($val)){
			var getstr = "&fileID="+$val+"&fileType=0";
			var url = AjaxStr("deldate",getstr);
			$.getJSON(url,data,function(res){
			switch (res.msg)
				{
					case 1: $item.remove();
							freshUserInformation();
							showCurFolder();
							break;
					case 3: $("#alertBan").modal('open');return false;
					default:alert("创建出现不可预料的错误！");break;
				}
				});			
		}
		else{
			//删除的是文件夹 
			if(r===0)
				r=confirm("删除文件夹将会导致文件夹下所有文件被删除，是否继续？");
			if (r==true)
			  {
			  	var getstr = "&fileID="+$val+"&fileType=1";
			  	var url = AjaxStr("deldate",getstr);
			  	$.getJSON(url,data,function(res){
			  	switch (res.msg)
			  		{
			  			case 1: $item.remove();
			  					freshUserInformation();
			  					showCurFolder();
			  					break;
			  			case 3: $("#alertBan").modal('open');return false;
			  			default:alert("创建出现不可预料的错误！");break;
			  		}
			  		});	
			  }			

		}
	});
	freshUserInformation();
}

var isFolder = function(fileID){
	var url = AjaxStr("isFolder","&fileID="+fileID)
    var data = "";
    var result = "";
    $.ajax({
        url: url,
        async: false,//改为同步方式
        type: "GET",
        data: data,
        success: function (res) {
            result = res;
        }
    });
    temp =  JSON.parse(result);
    if(temp.msg==1)return true;
    else return false;
}

var getTime = function(){
 	var t = new Date();
 	return t.toLocaleDateString()+" "+t.toLocaleTimeString();

 }

var getFileInner = function(fileID){
	var getstr = "&fileID="+fileID;
	var url = AjaxStr("getFileInner",getstr);
	var data = "";
	$.getJSON(url,data,function(res){
		if(res.locked == 1) $("#editSaveBtn").hide();
			else $("#editSaveBtn").show();
		editFileDom.fileInner.val(res.fileInner);
		$("#editPopUp").modal('open');
		});	
}

var changeFileInner = function(fileID){
	var getstr = "&fileID="+fileID;
	var url = AjaxStr("changeFileInner",getstr);
	var data = {'fileInner':editFileDom.fileInner.val()};
	$.post(url,data,function(res){
		});	
}

var fileEditInit = function(){
	globelTempFile = {};
   editFileDom.fileInner.val("");
   editFileDom.fileName.html("");
}

var checkAll = function(){
	$("tbody input").each(function(){
		$(this).prop("checked",true);
	});
}

var checkNone = function(){
	$("tbody input").each(function(){
		$(this).prop("checked",false);
	});
}
	
var showCurFolder = function(){
	var url = AjaxStr("showCurFolder","");
	var data = "";
    $.getJSON(url,data,function(res){
    	$("tbody").html("");
		$("#checkCtl").prop("checked",false);
    	$.each(res,function(i,e){
    		addView(e.fileID,e.fileName,e.fileOwner,e.fileType,e.fileCreateTime,e.isLocked);
    	});
    });
	breadcrumbFresh();
	
}

var breadcrumbFresh=function(){
	var $bread = $("ol.am-breadcrumb");
	var initStr = '<li><a href=javascript:getBackLastFolder();>返回上一级|</a></li><li><a href=javascript:enterFolder(0);>主目录</a></li>';
	$bread.html(initStr);
	//发送请求@
	var url = AjaxStr("breadcrumbFresh","");
	var data = "";
    $.getJSON(url,data,function(res){
    	$.each(res,function(i,e){
    		var str = '<li ><a href=javascript:enterFolder('+e.fileID+');>'+e.fileName+'</a></li>';
			$bread.append(str);
    	});
    	$("ol.am-breadcrumb li:last").html($("ol.am-breadcrumb li:last>a").html());
    });
	
}


var enterFolder = function(folderID){

   var getstr = "&folderID="+folderID;
	var url = AjaxStr("enterFolder",getstr);
	var data = "";
    $.getJSON(url,data,function(res){
    	switch (res.msg)
    		{
    			case 0: $("#alertBan").modal('open');return false;
    			case 1: showCurFolder();break;
    			default:alert("进入文件夹出现不可预料的错误！");break;
    		}
    });

}

var getBackLastFolder = function(){
	var joinHref = $("ol.am-breadcrumb a:last").attr("href");
	if(joinHref=="javascript:getBackLastFolder();")return ture;
	window.location.href = joinHref;
}

var storgeMAXSum = 0 ;
var storgeUsedSum = 0;
var showStorgePanel = function(){
	$("#strogePopUp").modal('open');
	var $storgeList = $("#storgeList");
	var $storgeSum = $(".strogeSum");
	var str1="<div class=am-u-sm-12> <div class='am-g storgeLi' > <div class=am-u-sm-3><span class=am-icon-user>  ";
	var str2= "</span></div> <div class=am-u-sm-9> <div class='am-progress  am-progress-striped am-active'> <div class='am-progress-bar am-progress-bar-warning'  style=width:";
	var str3="</div> <div class='am-progress-bar am-progress-bar-danger'  style=width:"
	var str4="</div> <div class='am-progress-bar am-progress-bar-success'  style=width:"
	var str5="</div> </div> <div class=am-fr> <div class='am-text-sm am-fr'>";
	var str6="</div></div> </div> </div> </div>"
	$storgeList.html('');
	//发送请求@
	var url = AjaxStr("showStorgePanel","");
	var data = "";
    $.getJSON(url,data,function(res){
    	$.each(res,function(i,e){
    	e.fileNum =parseInt(e.fileNum);
    	e.folderNum =parseInt(e.folderNum);	
    	e.storageMAX =parseInt(e.storageMAX);
    	var used = e.fileNum + e.folderNum;
		var surplus = e.storageMAX - used;
		var str = str1+e.name+str2+(e.fileNum/e.storageMAX)*100+"%>文件："+e.fileNum+str3+(e.folderNum/e.storageMAX)*100
		+"%>文件夹："+e.folderNum+str4+(surplus/e.storageMAX)*100+"%>剩余空间："+surplus+str5
		+"文件："+e.fileNum+" | 文件夹："+e.folderNum+" |  剩余空间："+surplus+str6;
		$storgeList.append(str);
		storgeUsedSum += used;
		storgeMAXSum += e.storageMAX;  		
    	});
    	$storgeSum.children(".area").html(storgeMAXSum);
		$storgeSum.children(".percentage").html(((storgeUsedSum/storgeMAXSum)*100).toFixed(2));
    });
	
}

//功能绑定

//网盘页
$(document).on("dblclick","tr",function(){
	var $fileID = $(this).children().children("input").val();
	var $fileName = $(this).children(".fileName").html();
	globelTempFile.fileName = $fileName;
	globelTempFile.fileID = $fileID;
	//发送请求@
	//
	if(!isFolder($fileID))
	{   
		editFileDom.fileName.html($fileName);
		getFileInner($fileID);		
		
	}
	else	enterFolder(globelTempFile.fileID);
})

$("#checkCtl").change(function(){
	if(this.checked==true)
		checkAll();
	else checkNone();
})

$('#delBtn').on('click', function() {
  		del();    
    });

$('#lockBtn').click(lockUnlock);

$('#newFileBtn').on('click', function() {
    $('#newFilePrompt').modal({
      relatedTarget: this,
      onConfirm: function(e) {
        add(parseInt(Math.random()*10000),e.data,0,getTime());
      },
      onCancel: function(e) {
      }
    });
});

$('#newFolderBtn').on('click', function() {
    $('#newFolderPrompt').modal({
      relatedTarget: this,
      onConfirm: function(e) {
        add(parseInt(Math.random()*10000),e.data,1,getTime(),0);
      },
      onCancel: function(e) {
      }
    });
});

$("#editFileBtn").on('click',function(e){
	e.preventDefault();
	$("tbody input:checked").each(function(){
		var $val = $(this).val();
		if($("tbody input:checked").length<2){
			if(isFolder($val)){
				$("#alertEditFolder").modal('open');
			}
			else{
				globelTempFile.fileID = $val;
				var fileName = $(this).parent().parent().children(".fileName").html();
				editFileDom.fileName.html(fileName);
				getFileInner($val);				
			}
		}
		else {
			$("#alertMultiedit").modal('open');
			 $("#editPopUp").modal('close');
			 fileEditInit();
			return false;
	}

	});
});

$("#editCloseBtn").click(function(){
   $("#editPopUp").modal('close')	
});

$("#editSaveBtn").click(function(){
   $("#editPopUp").modal('close');	
   changeFileInner(globelTempFile.fileID);
   fileEditInit();
});

$("#exit button").click(loginOut);
$("#showStorgeBtn").click(showStorgePanel);

//初始化
var isIndex;

var load = function(){
	if($("#loginTitle").length)isIndex = 1;
	else isIndex = 0;
	// loadDate();
	if(isIndex){

		}
	else{
			showCurFolder();
			freshUserInformation();	
			}
			
}()

//登录页
$("#loginBtn").click(login);
$("#loginPassWord").keydown(function(e){
  if (e.keyCode == 13) login();
})
$("#loginUserName").keydown(function(e){
  if (e.keyCode == 13) $("#loginPassWord").focus();
})
$("#regSubmitBtn").click(register);
$("#regPassWord").keydown(function(e){
  if (e.keyCode == 13) register();
})
$("#regUserName").keydown(function(e){
  if (e.keyCode == 13) $("#regPassWord").focus();
})

