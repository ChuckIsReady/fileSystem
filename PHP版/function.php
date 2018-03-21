<?php
header("Content-Type:text/html;charset=utf-8");
//文件夹子文件队列操作函数
function delMeminArr(&$arr,$Member){
    $key = array_search($Member, $arr);
    if ($key !== false)
        array_splice($arr, $key, 1);

}
function charArrPush ($arr,$newMember){

    if ($arr!="")
        $temp = explode(",",$arr);
    else $temp = array();
    $temp[] = $newMember;
    return arrTocharArr($temp);
}
function charArrDel ($arr,$delMember){
    $temp = explode(",",$arr);
    delMeminArr($temp,$delMember);
    return arrTocharArr($temp);
}
function charArrToArr ($arr){
    if ($arr =="") return array();
    return explode(",",$arr);
}
function arrTocharArr($arr){
    if(!isset($arr[0])) return "";
    return implode(",",$arr);
}
//文件夹子文件队列操作函数 结束

//数据库操作
function dbConnect(){
    $GLOBALS['dbObj'] = mysql_connect("localhost","root","root");
    if (!$GLOBALS['dbObj'])
    {
        die('Could not connect: ' . mysql_error());
    }
    mysql_query("SET NAMES UTF8");
    mysql_select_db("file_system", $GLOBALS['dbObj'] );
}

function dbSelect($table,$par = '*',$condition = '1=1'){
    $result = mysql_query("SELECT $par FROM $table WHERE $condition");
    $items = array();
    if($result)
        while($row = mysql_fetch_array($result,MYSQL_ASSOC))
        {
            array_push($items, $row);
        }
    return $items;
}
function dbSelectOne($table,$condition = '1=1'){
    $result = mysql_query("SELECT * FROM $table WHERE $condition LIMIT 1");
    $items = array();
    if($result)
        while($row = mysql_fetch_array($result,MYSQL_ASSOC))
        {
            array_push($items, $row);
        }
    return $items;
}

function dbAdd($table,$valueStr){
    $sql = "INSERT INTO  $table VALUE ($valueStr)";
    $result = mysql_query($sql);
}

function dbdel($table,$checkName,$value){


    $sql = "DELETE FROM $table WHERE `$checkName` = '$value' ";
    $result = mysql_query($sql);
    return $result;
}

function dbChange($table,$checkName,$value,$changeName,$newValue){

    $sql = "UPDATE $table SET $changeName = \"$newValue\" WHERE $checkName = $value";
    $result = mysql_query($sql);
}

function isFolder($fileID){
    $temp = dbSelectOne("file_detail","fileID = $fileID");
    if($temp[0]["fileType"]==1)return 1;
    return 0;
}

function isFolderAjax($fileID){
    $temp = dbSelectOne("file_detail","fileID = $fileID");
    if($temp[0]["fileType"]==1)
        {msg(1);return 1;};
    msg(0);
    return 0;
}
function login($username,$password){
    $temp = dbSelectOne("user","name=\"$username\"");
        if($temp!=null&&$password==$temp[0]['passWord']) {
            $temp2 = array("msg"=>"1");
            $_SESSION["cur"]["curUser"] ="";
            $_SESSION["cur"]["curUser"]["name"]=$temp[0]['name'];
            $_SESSION["cur"]["curUser"]["fileNum"]=$temp[0]['fileNum'];
            $_SESSION["cur"]["curUser"]["folderNum"]=$temp[0]['folderNum'];
            $_SESSION["cur"]["curUser"]["storageMAX"]=$temp[0]['storageMAX'];
            $_SESSION["cur"]['curFolderOwner'] = 'admin';
            $_SESSION["cur"]['curFolderID'] = 0 ;
        }
      else{
          unset($_SESSION["cur"]["user"]);
          $temp2 = array("msg"=>"0");
      }
        echo json_encode($temp2);
}
function addDate($fileID,$fileName,$fileOwner,$fileType,$fileCreateTime,$folderID){
    //权限控制
    if(!AccessControl($_SESSION["cur"]["curFolderID"])){msg(3);return false;}
        if(isRepeat($fileName)) {msg(0);return false;}
        $fileName = trim($fileName);
        if($fileName=="") {msg(2);return false;}
        $_SESSION["cur"]["curFileNameArr"][]=$_GET['fileName'];
        $_SESSION["cur"]["curFoloderFileArr"][]=array("fileID"=>$fileID,"fileName"=>$fileName,"fileOwner"=>$fileOwner,
            "fileType"=>$fileType,"fileCreateTime"=>$fileCreateTime,"isLocked"=>0);
        //FDAdd //增加文件或者文件夹到详情表
        dbAdd("file_detail","$fileID,\"$fileName\",\"$fileOwner\",$fileType,\"$fileCreateTime\",0");
        if($fileType==1){
            // 当增加的是文件夹时
            $_SESSION["cur"]["curUser"]["folderNum"]++;
            //增加文件夹到文件夹关系表
            dbAdd("folder_relationship","$fileID,\"\",$folderID");
            //修改父文件夹的文件夹关系表
            $temp = dbSelectOne("folder_relationship","fileID=$folderID");
            $tempArrStr = $temp[0]['childrenFileIDArr'];
            $tempArrStr = charArrPush($tempArrStr,$fileID);
            dbChange("folder_relationship","fileID",$folderID,"childrenFileIDArr",$tempArrStr);
        }
        else{
            //当增加的是文件时
            $_SESSION["cur"]["curUser"]["fileNum"]++;
            //增加文件到文件内容表
            dbAdd("file_inner","$fileID,\"\"");
            //修改父文件夹的文件夹关系表
            $temp = dbSelectOne("folder_relationship","fileID=$folderID");
            $tempArrStr = $temp[0]['childrenFileIDArr'];
            $tempArrStr = charArrPush($tempArrStr,$fileID);
            dbChange("folder_relationship","fileID",$folderID,"childrenFileIDArr",$tempArrStr);

        }
        $temp = array("msg"=>1,"fileOwner"=>$fileOwner);
        echo json_encode($temp);
        return true;
}
function delDate($fileID,$fileType,$parentFolderID){

    if(!AccessControl($_SESSION["cur"]["curFolderID"])){msg(3);return false;}
    if($fileType==1) {//删除文件夹
        $_SESSION["cur"]["curUser"]["folderNum"]--;
        $temp = dbSelectOne("folder_relationship","fileID=$fileID");
        $tempArr = charArrToArr($temp[0]['childrenFileIDArr']);
        foreach($tempArr as $value){//递归删除
            $tempType = isFolder($value);
            deldate($value,$tempType,$fileID);
        }
        //无需调整子文件夹的父文件夹关系，因为全部删除
        //只需要调整最初删除的文件夹的父文件关系
        //对于文件夹删除来说，需要调整的是FR、RD张表
        dbdel("folder_relationship","fileID",$fileID);
        dbdel("file_detail","fileID",$fileID);
        if($parentFolderID==$_SESSION["cur"]['curFolderID']){
            $temp = dbSelectOne("folder_relationship","fileID=$parentFolderID");
            $tempArrStr = $temp[0]['childrenFileIDArr'];
            $tempArrStr = charArrDel($tempArrStr,$fileID);
            dbChange("folder_relationship","fileID",$parentFolderID,"childrenFileIDArr",$tempArrStr);
            msg(1);
        }
    }
    else{
        //删除文件
        //对于文件删除来说，需要调整的是FD和FI和FR三张表
        $_SESSION["cur"]["curUser"]["fileNum"]--;
        dbdel("file_inner","fileID",$fileID);
        dbdel("file_detail","fileID",$fileID);
        //调整父文件的子文件数组
        $temp = dbSelectOne("folder_relationship","fileID=$parentFolderID");
        $tempArrStr = $temp[0]['childrenFileIDArr'];
        $tempArrStr = charArrDel($tempArrStr,$fileID);
        dbChange("folder_relationship","fileID",$parentFolderID,"childrenFileIDArr",$tempArrStr);
        if($parentFolderID==$_SESSION["cur"]['curFolderID']) msg(1);
    }
}
function showCurFolder(){
    if(!isset($_SESSION['cur']['curFolderID'])) $_SESSION['cur']['curFolderID']=0;
        $_SESSION["cur"]["curFileNameArr"] = array();;
        $_SESSION["cur"]["curFoloderFileArr"] = array();
        $curFolderID = $_SESSION['cur']['curFolderID'];
        $temp = dbSelectOne("folder_relationship","fileID= $curFolderID");
        $tempArr = charArrToArr($temp[0]['childrenFileIDArr']);
        $fileArr = array();
        foreach($tempArr as $value){//递归显示信息
            $temp = dbSelectOne("file_detail","fileID = $value");
            if(isset($temp[0])){
                $fileArr[] =$temp[0];
                $_SESSION["cur"]["curFileNameArr"][] = $temp[0]['fileName'];
                $_SESSION["cur"]["curFoloderFileArr"][] = $temp[0];
            }
        }
        echo json_encode($fileArr);
}
function Arrget($arr,$fileID){
    foreach($arr as $value){
        if($value['fileID']==$fileID) return $value;

    }
}

function isRepeat ($fileName){
    if(!isset($_SESSION["cur"]["curFileNameArr"]))$_SESSION["cur"]["curFileNameArr"] = array();
    foreach($_SESSION["cur"]["curFileNameArr"] as $value){
        if($value==$fileName) return true;
    }
    return false;
}

function getFDBycurFolder($fileID){
    $main = array('fileName'=>"主目录",'fileOwner'=>"admin");
	if($fileID==0) return $main;
    $temp = Arrget($_SESSION["cur"]["curFoloderFileArr"],$fileID);
    return $temp;

}
function AccessControl ($fileID){
    if($_SESSION["cur"]['curUser']['name']=="admin"||
        $_SESSION["cur"]['curUser']['name']==$_SESSION["cur"]['curFolderOwner'])
        return true;
    return false;
}

function lockControl ($fileID){
    if($_SESSION["cur"]['curUser']['name']=="admin")return true;
    if($fileID == 0)return true;
    $temp = getFDBycurFolder($fileID);
    if(!isset($temp['filetype'])){
//        当前目录中没有，到数据库中查询
        $temp = dbSelectOne("file_detail","fileID = $fileID");
        if($temp[0]['isLocked']!= true||$temp[0]['fileOwner']==$_SESSION["cur"]['curUser']['name'] )
            return true;
    }
    else if ($temp['isLocked']!= true||$temp['fileOwner']==$_SESSION["cur"]['curUser']['name'])
        return true;
    else return false;
}

function lockUnlock ($fileID){
    $temp = Arrget($_SESSION["cur"]["curFoloderFileArr"],$fileID);
    if(AccessControl($fileID)){
        dbChange("file_detail","fileID",$fileID,"isLocked",$temp['isLocked']?0:1);
//        var_dump(!$temp['isLocked']);
        msg(1);
    }
    else msg(0);
}

function msg($num){
    $temp = array('msg'=>$num);
    echo json_encode($temp);
}

function getFileInner($fileID){
    $power = lockControl($fileID) ? 0 : 1;
    $temp = dbSelectOne("file_inner","fileID = $fileID");
    $arr = array('fileID'=>$fileID,"fileInner"=>$temp[0]['fileInner'],'locked'=>$power);
    echo json_encode($arr);

}

function changeFileInner($fileID){
    if(!lockControl($fileID)&&!AccessControl($fileID)) {die("请不要非法操作！文件已锁，禁止他人修改！"); }
    dbChange("file_inner","fileID",$fileID,"fileInner",$_POST['fileInner']);
    echo "修改成功";
}

function breadcrumbFresh(){
    if(!isset($_SESSION["cur"]['breadcrumbStack']))
        $_SESSION["cur"]['breadcrumbStack'] = array();
        $temp = json_encode($_SESSION["cur"]['breadcrumbStack']);
    echo $temp;
}

function arrat2d_search($mem,$arr){
    $temp = false;
    foreach ($arr as $key => $value) {
        if($value['fileID'] == $mem)
            $temp = $key;
    }
    return $temp;
}

function arrDelTail(&$arr,$mem){
    $temp = arrat2d_search($mem,$arr);
    if($temp === false) return false;
    array_splice($arr,$temp+1);
    return true;
}
function breadcrumbSearch($folderID){
    return arrDelTail($_SESSION["cur"]['breadcrumbStack'],$folderID);
}

function enterFolder ($folderID){
    if($folderID!=0&&!lockControl($folderID)) MSg(0);
    $_SESSION["cur"]['curFolderID'] = $folderID;
    if($folderID == 0 ){
        $_SESSION["cur"]['curFolderOwner'] =="admin";
        $_SESSION["cur"]['breadcrumbStack']=array();
        msg(1);
        return;
    }
    else{
        $temp = getFDBycurFolder($folderID);
        if(!isset($temp['filetype'])){
    //        当前目录中没有，到数据库中查询
            $temp = dbSelectOne("file_detail","fileID = $folderID");
            $_SESSION["cur"]['curFolderOwner'] = $temp[0]['fileOwner'];
        }
        else $_SESSION["cur"]['curFolderOwner'] = $temp['fileOwner'];
    }
    if(!breadcrumbSearch($folderID)){
        $temp= array("fileID"=>$folderID,
            "fileName"=>(isset($temp['fileName'])?$temp['fileName']:$temp[0]['fileName']));
        $_SESSION["cur"]['breadcrumbStack'][]=$temp;
    }    
    msg(1);
}

function showStorgePanel(){
    saveUser();
    $temp = dbSelect("user");
    foreach($temp as $key=>$value) {
        array_splice($temp[$key],1,1);
    }
    echo json_encode($temp);
}

function freshUserInformation(){
    $name = $_SESSION['cur']['curUser']['name'];
    $fileNum = $_SESSION['cur']['curUser']['fileNum'];
    $folderNum = $_SESSION['cur']['curUser']['folderNum'];
    $hasStorage = $fileNum+$folderNum;
    $storageMAX = $_SESSION['cur']['curUser']['storageMAX'];
    $temp = array('name'=>$name,'fileNum'=>$fileNum,'folderNum'=>$folderNum,'hasStorage'=>$hasStorage,"storageMAX"=>$storageMAX);
    echo json_encode($temp);
}

function loginOut (){
    saveUser();
    unset($_SESSION['cur']['curUser']);
    $_SESSION['cur']['curUser'] = 0;
    $_SESSION['cur']['curFileNameArr'] =array();
    $_SESSION['cur']['breadcrumbStack'] = array();
    msg(1);
}
function getTime(){
    date_default_timezone_set('Asia/Shanghai');
    $timeState = date('H') > 12 ? "上午" : "下午";
    return date("Y/m/d  $timeState" . "h:i:s");
}
function newUserInitDate($userName){
    $userFolderID = rand(1,10000);
    $userWeclomeFileID = rand(1,10000);
    $userWeclomeFileName = '欢迎使用.txt';
    $userWeclomeStr = "亲爱的$userName,\n\t欢迎使用Chuck文件系统！祝你有个好心情！";
    $time = getTime();
    //增加用户名文件夹
    dbAdd("file_detail","$userFolderID,\"$userName\",\"$userName\",1,\"$time\",0");
    dbAdd("folder_relationship","$userFolderID,\"$userWeclomeFileID\",0");
    $temp = dbSelectOne("folder_relationship","fileID=0");
    $tempArrStr = $temp[0]['childrenFileIDArr'];
    $tempArrStr = charArrPush($tempArrStr,$userFolderID);
    dbChange("folder_relationship","fileID",0,"childrenFileIDArr",$tempArrStr);
    //增加欢迎文件
    dbAdd("file_inner","$userWeclomeFileID,\"$userWeclomeStr\"");
    dbAdd("file_detail","$userWeclomeFileID,\"欢迎使用.txt\",\"$userName\",0,\"$time\",1");
}

function register($userName,$passWord){

    $userName = trim($userName);
    if($userName=="") {msg(2);return false;}//名字空白
    $temp=dbSelect("user","name");
    foreach($temp as $value){
        if($value['name'] == $userName)
            {msg(3);return false;}//名字重复
    }
    //注册用户身份，分配初始文件
    //默认用户最大允许存放30个文件或文件夹
    $str = "\"$userName\",\"$passWord\",1,0,30";
    dbAdd("user",$str);
    newUserInitDate($userName);
    msg(1);
}

function saveUser(){
    $name = $_SESSION['cur']['curUser']['name'];
    $fileNum = $_SESSION['cur']['curUser']['fileNum'];
    $folderNum = $_SESSION['cur']['curUser']['folderNum'];
    $namestr = "'$name'";
    dbChange("user","name",$namestr,"fileNum",$fileNum);
    dbChange("user","name",$namestr,"folderNum",$folderNum);
}

?>
