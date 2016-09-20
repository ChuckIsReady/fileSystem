// 数据结构
// 用户表 User
// 由 用户名，密码，用户建立的文件数，用户建立的文件夹数，
// 用户能建立的文件夹与文件夹上限数组成

var Table ={}; 
// 所有表集中在一个变量下，方便存取与减少全局变量个数
Table.User = [];
var UserAdd = function(name,passWord,fileNum,folderNum,storageMAX,doNotNeedInitDate){
   var temp={};
   temp.name = name;
   temp.passWord = passWord;
   temp.fileNum = fileNum;
   temp.folderNum = folderNum;
   temp.storageMAX = storageMAX;
   Table.User.push(temp);
   if(doNotNeedInitDate==undefined)
   newUserInitDate(name);
}
Table.cur = {}
Table.cur.curUser ={};

var authenticate = function(userName,passWord){
    var temp = get(Table.User,"name",userName);
    	if(temp.length>0&&temp[0].passWord == passWord)
    	{
    		Table.cur.curUser.name = temp[0].name;
	    	Table.cur.curUser.fileNum = temp[0].fileNum;
	    	Table.cur.curUser.folderNum = temp[0].folderNum;
	    	Table.cur.curUser.storageMAX = temp[0].storageMAX;
    		return 1;
        }
        return 0;
}
var login = function(){
	
	var $userName = $("#loginUserName");
	var $passWord = $("#loginPassWord");
	var $loginState = $("#loginState");
	if(authenticate($userName.val(),$passWord.val())){
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
var newUserInitDate = function (userName){
	var userFolderID; 
	userFolderID = parseInt(Math.random()*10000);
	var userWeclomeFileID ;
	userWeclomeFileID =parseInt(Math.random()*10000);
	var userWeclomeStr = "亲爱的";
	userWeclomeStr+= userName;
	userWeclomeStr+= ",\n\t欢迎使用Chuck文件系统！祝你有个好心情！";
	adddate(userFolderID,userName,userName,1,getTime(),0,1);
	adddate(userWeclomeFileID,"欢迎使用Chuck文件系统.txt",userName,0,getTime(),userFolderID,1);
	FDChange(userWeclomeFileID,"isLocked",true);
	Table.FI = remove(Table.FI,'fileID',userWeclomeFileID);
	FIAdd(userWeclomeFileID,userWeclomeStr);
	
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
	//检测用户是否重名
	var  len = Table.User.length;
	for(var i = 0;i<len;i++){
		if (Table.User[i].name === $userNameVal) 
			 {
			 	$regState.parent().addClass("am-form-error");
			 	$regState.html("用户已经存在！")
			 	$userName.parent().addClass("am-form-error");
			 	$userName.focus();
			 	return false;
			 }
	}
	//注册用户身份，分配初始文件
	//默认用户最大允许存放30个文件或文件夹
	UserAdd($userNameVal,$passWord.val(),1,0,30);
	$regState.html($userNameVal+"注册成功");
	$regState.parent().removeClass("am-form-error").addClass("am-form-success");
	$userName.parent().removeClass("am-form-error");
	$("#loginUserName").focus();
	
}

var loginOut = function(){
	Table.cur.curUser ={};
	Table.cur.curFolderID=0;
	Table.cur.curFileNameArr=[];
	Table.cur.breadcrumbStack = [];
	window.location.href = "index.html";
}

// 数组对象 操作程序
function remove(arrName,objPropery,objValue)
{
   return $.grep(arrName, function(cur,i){
          return cur[objPropery]!=objValue;
       });
}
function get(arrName,objPropery,objValue)
{
   return $.grep(arrName, function(cur,i){
          return cur[objPropery]==objValue;
       });
}
// 文件夹关系表 FolderRelationship
// 由 文件夹的文件id,文件夹包含的文件id组,父文件夹id 组成
Table.FR = [];
var FRAdd = function(fileID,childrenFileIDArr,parentFolderID){
	var temp = {}
    temp.fileID = fileID,
	temp.childrenFileIDArr = childrenFileIDArr;
	temp.parentFolderID = parentFolderID;
	Table.FR.push(temp);
}

//默认底层目录
Table.cur.curFolderID = 0;
// 文件详细信息 FileDtail
// 由 文件id，文件（夹）名，文件主人，文件类型，文件创建时间 组成
Table.FD =[];	
var FDAdd = function(fileID,fileName,fileOwner,fileType,fileCreateTime){
	var temp = {}
    temp.fileID = fileID,
	temp.fileName = fileName;
	temp.fileOwner = fileOwner;
	temp.fileType = fileType;
	temp.fileCreateTime = fileCreateTime;
	//默认未加锁人人可读不可写，加锁后不可读，管理员不受限制
	//只能对自己的文件加锁
	temp.isLocked = 0;  
	Table.FD.push(temp);
}
var FDChange = function(fileID,objPropery,objNewValue){
	return $.grep(Table.FD, function(cur,i){
			if (cur['fileID'] == fileID)
					cur[objPropery] = objNewValue;
          return;
       });
}
//文件内容表 FileInner
//由文件ID，文件内容组成
Table.FI = [];
var FIAdd = function(fileID,fileInner){
	var temp = {}
	temp.fileID = fileID;
	temp.fileInner = fileInner;
	Table.FI.push(temp);
};

//记录当前目录的目录名和文件名的列表，防止同页面重名
Table.cur.curFileNameArr = [];
var isRepeat = function(fileName){
	var  len = Table.cur.curFileNameArr.length;
	for(var i = 0;i<len;i++){
		if (Table.cur.curFileNameArr[i] === fileName) 
			 return 1;
	}
	return 0;
}

var getFDBycurFolder = function(fileID){
	var main = {fileName:"主目录",fileOwner:"admin"};
	if(fileID==0) return main;
	var temp = get(Table.cur.curFoloderFileArr,"fileID",fileID);
	return temp[0];
}

var adddate = function(fileID,fileName,fileOwner,fileType,fileCreateTime,folderID,isReg){
	
	if(!isReg&&isRepeat(fileName))return 0;//禁止重名
	if (fileName.replace(/(^\s*)|(\s*$)/g, "").length ==0) return 2;//禁止空白名字文件并去除文件名前后的空白
	Table.cur.curFileNameArr.push(fileName);
	FDAdd(fileID,fileName,fileOwner,fileType,fileCreateTime);//增加文件或者文件夹到详情表
	Table.cur.curFoloderFileArr.push({fileID:fileID,fileName:fileName,fileOwner:fileOwner,fileType:fileType,fileCreateTime:fileCreateTime,isLocked:0});
	if(fileType){
		// 当增加的是文件夹时
		Table.cur.curUser.folderNum++;
		var emptyFloder = [];
		var temp = [];
		//增加文件夹到文件夹关系表
		FRAdd(fileID,emptyFloder,folderID);
		//修改父文件夹的文件夹关系表
		temp=get(Table.FR,'fileID',folderID);
		temp[0].childrenFileIDArr.push(fileID);
		Table.FR = remove(Table.FR,'fileID',folderID);
		FRAdd(folderID,temp[0].childrenFileIDArr,temp[0].parentFolderID);
	}
	else{
		//当增加的是文件时
		Table.cur.curUser.fileNum++;
		var emptyInner = "";
		var temp = [];
		//增加文件到文件内容表
		FIAdd(fileID, emptyInner);
		//修改父文件夹的文件夹关系表
		temp=get(Table.FR,'fileID',folderID);
		temp[0].childrenFileIDArr.push(fileID);
		Table.FR = remove(Table.FR,'fileID',folderID);
		FRAdd(folderID,temp[0].childrenFileIDArr,temp[0].parentFolderID);
	}

	return 1;
}

var delFactorByVal = function(arr,value){
	var  len = arr.length;
	for(var i = 0;i<len;i++){
		if (arr[i] === value) 
			 arr.splice(i,1);
	}
}
var deldate = function(fileID,fileType,parentFolderID){
	fileID = parseInt(fileID);
	if(fileType){//删除文件夹
		var tempFR = get(Table.FR,'fileID',fileID);
		//递归删除
		Table.cur.curUser.folderNum--;	
		if(tempFR[0].childrenFileIDArr.length!=0)
		{
			$.each(tempFR[0].childrenFileIDArr,function(i,e){
				var tempType = !isFile(e);
				deldate(e,tempType,fileID);					
			});
		}
		
		//无需调整子文件夹的父文件夹关系，因为全部删除
		//只需要调整最初删除的文件夹的父文件关系
		//对于文件夹删除来说，需要调整的是FR、RD张表
		
		Table.FR = remove(Table.FR,'fileID',fileID);
		Table.FD = remove(Table.FD,'fileID',fileID);
		if(parentFolderID == Table.cur.curFolderID){
			var temp = get(Table.FR,'fileID',parentFolderID);
			var temparr = temp[0].childrenFileIDArr;
			delFactorByVal(temparr,fileID)
			Table.FR = remove(Table.FR,'fileID',parentFolderID);
			FRAdd(parentFolderID,temparr,temp[0].parentFolderID);
			showCurFolder();//全部删除后刷新目录
		}
	}
	else{//删除文件
		//对于文件删除来说，需要调整的是FD和FI和FR三张表
		Table.cur.curUser.fileNum--;
		Table.FD = remove(Table.FD,'fileID',fileID);
		Table.FI = remove(Table.FI,'fileID',fileID);
		//调整父文件的子文件数组
		var temp = get(Table.FR,'fileID',parentFolderID);
		var temparr = temp[0].childrenFileIDArr;
		delFactorByVal(temparr,fileID);
		Table.FR = remove(Table.FR,'fileID',parentFolderID);
		FRAdd(parentFolderID,temparr,temp[0].parentFolderID);
	}
	return 1;
}
var loadDate = function(){
	Table = JSON.parse(localStorage.getItem("ChuckFileSystem"));
}
var saveDate = function(){
	localStorage.setItem("ChuckFileSystem",JSON.stringify(Table));
}
//以上为数据操作


var freshUserInformation =function(){
	var hasStorage = Table.cur.curUser.fileNum + Table.cur.curUser.folderNum;
	$("#storgeInformation .am-progress-bar").css("width",(hasStorage/Table.cur.curUser.storageMAX)*100+"%");
	$("#storgeInformation span").html(hasStorage+"/"+Table.cur.curUser.storageMAX);
	$("#userName span").html(" "+Table.cur.curUser.name);
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
	
	if(isLocked){
		s1+="</td><td class=lockIcon ><i class='am-icon-lock colorLock'></i></td></tr>";

	}
	else {
		s1+="</td><td class=lockIcon ><i class='am-icon-unlock colorUnlock'></i></td></tr>";

	}
	$("#fileTable").append(s1);
	freshUserInformation();
}
var AccessControl = function(fileID){

	if(Table.cur.curUser.name == "admin"||Table.cur.curFolderOwner == Table.cur.curUser.name)
	{
		return true;
	}
	else {	
		return false;
	}
}
var lockControl = function(fileID){
	if(fileID == 0)return true;
	var temp = getFDBycurFolder(fileID);
	if(temp==undefined) {
	   	temp = get(Table.FD,"fileID",fileID);
	   	if(Table.cur.curUser.name == "admin"||temp[0].isLocked != true||temp[0].fileOwner == Table.cur.curUser.name)
	     return true;
   	}
	else if(Table.cur.curUser.name == "admin"||temp.isLocked != true||temp.fileOwner == Table.cur.curUser.name)
	{
		return true;
	}
	else {
		return false;
	}
}
var add = function(fileID,fileName,fileOwner,fileType,fileCreateTime){
	if(!AccessControl(Table.cur.curFolderID)) {$("#alertBan").modal('open');return false;}
	var message = adddate(fileID,fileName,fileOwner,fileType,fileCreateTime,Table.cur.curFolderID)
	switch (message)
	{
		case 0: $("#alertRepeat").modal('open');break;
		case 1:addView(fileID,fileName,fileOwner,fileType,fileCreateTime);break;
		case 2: $("#alertEmpty").modal('open');break;
		default:alert("创建出现不可预料的错误！");break;
	}
}

var lockUnlock  = function(){
	//不做递归锁
	$("tbody input:checked").each(function(){
		var $val = $(this).val();
		//用户权限管理
		var temp = getFDBycurFolder($val);
		if(AccessControl($val))
			FDChange($val,"isLocked",!temp.isLocked);
		else 
		{
			$("#alertBan").modal('open');
			return false;
		}
			
	});
	showCurFolder();
}

var del = function(){
	var r =false;
	if(!AccessControl(Table.cur.curFolderID)) {$("#alertBan").modal('open');return false;}
	$("tbody input:checked").each(function(){
		var $val = $(this).val();
		//进入框架的prompt之后局部变量会异变，需要借助全局变量
		var $item = $(this).parent().parent();
		if(isFile($val)){
			deldate($val,0,Table.cur.curFolderID);
			$item.remove();
		}
		else{
			//删除的是文件夹 
			if(r == false)
				r=confirm("删除文件夹将会导致文件夹下所有文件被删除，是否继续？");
			if (r==true)
			  {
			  	deldate($val,1,Table.cur.curFolderID);
				$item.remove();
			  }			

		}
	});
	freshUserInformation();
}
var isFile = function(fileID){
	var temp = get(Table.FD,"fileID",fileID)
	if (temp[0].fileType !=1)
	return 1;
	else return 0;
}
 var getTime = function(){
 	var t = new Date();
 	return t.toLocaleDateString()+" "+t.toLocaleTimeString();

 }

var getFileInner = function(fileID){
	var file = get(Table.FI,'fileID',fileID);
   	globelTempFile.fileID = file[0].fileID,
	globelTempFile.fileInner = file[0].fileInner;
}
var changeFileInner = function(fileID){
	if(!lockControl(fileID)&&!AccessControl(fileID)) {alert("请不要非法操作！文件已锁，禁止他人修改！"); return false;}
	Table.FI = remove(Table.FI,'fileID',fileID);
	FIAdd(fileID,editFileDom.fileInner.val());
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
	$("tbody").html("");
	$("#checkCtl").prop("checked",false);
	Table.cur.curFileNameArr = [];
	Table.cur.curFoloderFileArr=[];
	var filearr = get(Table.FR,"fileID",Table.cur.curFolderID);
	$.each(filearr[0].childrenFileIDArr,function(i,e){
        var temp = get(Table.FD,"fileID",e);
		addView(temp[0].fileID,temp[0].fileName,temp[0].fileOwner,temp[0].fileType,temp[0].fileCreateTime,temp[0].isLocked);
		Table.cur.curFileNameArr.push(temp[0].fileName);
		Table.cur.curFoloderFileArr.push(temp[0]);
	});
	breadcrumbFresh();
	
}
var breadcrumbFresh=function(){
	var $bread = $("ol.am-breadcrumb");
	var initStr = '<li><a href=javascript:getBackLastFolder();>返回上一级|</a></li><li><a href=javascript:enterFolder(0);>主目录</a></li>';
	$bread.html(initStr);
	
	$.each(Table.cur.breadcrumbStack,function(i,e){
		var str = '<li ><a href=javascript:enterFolder('+e.fileID+');>'+e.fileName+'</a></li>';
		$bread.append(str);
	})
	$("ol.am-breadcrumb li:last").html($("ol.am-breadcrumb li:last>a").html());
}
var breadcrumbSearch=function(folderID){
	var get = 0;
	var sum = Table.cur.breadcrumbStack.length 
	for (var i = 0 ; i < sum; i++) {
		if(get){
			Table.cur.breadcrumbStack.length--;
			continue;
		}
		if(Table.cur.breadcrumbStack[i].fileID == folderID)
			get = 1;
		
	}
	if(get)return 1;
	return 0;
}
var enterFolder = function(folderID){

   	if(folderID!=0&&!lockControl(folderID)) { $("#alertBan").modal('open');return false;}
   Table.cur.curFolderID = folderID;
   var temp = getFDBycurFolder(folderID);
   if(temp==undefined) {
   	temp = get(Table.FD,"fileID",folderID)
   	Table.cur.curFolderOwner = temp[0].fileOwner;
   }
   else Table.cur.curFolderOwner = temp.fileOwner;
   showCurFolder();
   if(folderID==0){Table.cur.breadcrumbStack=[];breadcrumbFresh();return;}
   if(!breadcrumbSearch(folderID))
   		Table.cur.breadcrumbStack[Table.cur.breadcrumbStack.length]={fileID:folderID,fileName:globelTempFile.fileName};
   breadcrumbFresh();
}

var getBackLastFolder = function(){
	var joinHref = $("ol.am-breadcrumb a:last").attr("href");
	if(joinHref=="javascript:getBackLastFolder();")return ture;
	window.location.href = joinHref;
}
var showStorgePanel = function(){
	$("#strogePopUp").modal('open');
	var $storgeList = $("#storgeList");
	var $storgeSum = $(".strogeSum");
	var storgeMAXSum = 0 ;
	var storgeUsedSum = 0;
	var str1="<div class=am-u-sm-12> <div class='am-g storgeLi' > <div class=am-u-sm-3><span class=am-icon-user>  ";
	var str2= "</span></div> <div class=am-u-sm-9> <div class='am-progress  am-progress-striped am-active'> <div class='am-progress-bar am-progress-bar-warning'  style=width:";
	var str3="</div> <div class='am-progress-bar am-progress-bar-danger'  style=width:"
	var str4="</div> <div class='am-progress-bar am-progress-bar-success'  style=width:"
	var str5="</div> </div> <div class=am-fr> <div class='am-text-sm am-fr'>";
	var str6="</div></div> </div> </div> </div>"
	$storgeList.html('');
	$.each(Table.User,function(){
		var e = $(this)[0]
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
}
//功能绑定

//网盘页
$(document).on("dblclick","tr",function(){
	var $fileID = $(this).children().children("input").val();
	var $fileName = $(this).children(".fileName").html();
	globelTempFile.fileName = $fileName;
	globelTempFile.fileID = $fileID;
	if(isFile($fileID))
	{
		if(!lockControl($fileID)) $("#editSaveBtn").hide();
			else $("#editSaveBtn").show();
		getFileInner($fileID);		
		editFileDom.fileName.html($fileName);
		editFileDom.fileInner.val(globelTempFile.fileInner);
		$("#editPopUp").modal('open');
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
        add(parseInt(Math.random()*10000),e.data,Table.cur.curUser.name,0,getTime());
      },
      onCancel: function(e) {
      }
    });
  });
$('#newFolderBtn').on('click', function() {
    $('#newFolderPrompt').modal({
      relatedTarget: this,
      onConfirm: function(e) {
        add(parseInt(Math.random()*10000),e.data,Table.cur.curUser.name,1,getTime());
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
			if(isFile($val)==0){
				$("#alertEditFolder").modal('open');
			}
			else{
				getFileInner($val);
				if(!AccessControl($val)) $("#editSaveBtn").hide();
				else $("#editSaveBtn").show();
				var fileName = $(this).parent().parent().children(".fileName").html();
				editFileDom.fileName.html(fileName);
				editFileDom.fileInner.val(globelTempFile.fileInner);
				$("#editPopUp").modal('open');
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
})
$("#exit button").click(loginOut);
$("#showStorgeBtn").click(showStorgePanel)
//当页面退出刷新时保存数据
window.onbeforeunload = function()
{
    saveDate();	
}

//初始化
var isIndex;
var initDate = function(){
	Table = {};
	Table.User = [];
	Table.FI = [];
	Table.FR = [];
	Table.FD = [];
	Table.cur ={};
	Table.cur.curUser ={};
	Table.cur.curFolderID=0;
	Table.cur.curFolderOwner="admin";
	Table.cur.curFileNameArr=[];
	Table.cur.curFoloderFileArr=[];
	Table.cur.breadcrumbStack = [];
	FRAdd(0,[],0);
	UserAdd("admin","",0,0,100,1);//管理员允许建立100个文件，没有初始文件
	UserAdd("Chuck","",1,0,30);
	UserAdd("Amanda","",1,0,30);
	UserAdd("Christina","",1,0,30);
	UserAdd("Alexander","",1,0,30);
	
	saveDate();
}

var load = function(){
	if($("#loginTitle").length)isIndex = 1;
	else isIndex = 0;
	loadDate();
	if(Table===null)initDate();
	if(isIndex){

		}
	else{
		if(Table.cur.curUser.name==undefined){
			//阻止直接打开管理页面，强制必须登录才能进入
			window.location.href = "index.html";
		}
		else{

		showCurFolder();
		freshUserInformation();	

		}
		
	}
}()

//登录页
$("#initBtn").click(initDate);
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

