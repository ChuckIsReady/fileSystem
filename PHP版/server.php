<?php
header("Content-Type:text/html;charset=utf-8");
$do = $_GET['do'];
$inAjax = $_GET['inAjax'];

if(!$inAjax) return false;
include_once "function.php";
dbConnect();

$do = $do?$do:"default";
session_start();



switch($do){
    case "login":
        $username = $_POST['username'];
        $password = $_POST['password'];
        login($username,$password);
        break;

    case"adddate":
        $fileID = $_GET['fileID'];
        $fileName = $_GET['fileName'];
        $fileOwner = $_SESSION["cur"]["curUser"]["name"];
        $fileType = $_GET['fileType'];
        $fileCreateTime = $_GET['fileCreateTime'];
        $folderID = $_SESSION["cur"]["curFolderID"];      
        addDate($fileID,$fileName,$fileOwner,$fileType,$fileCreateTime,$folderID);
        break;

    case"deldate":
        $fileID = $_GET['fileID'];
        $fileType = $_GET['fileType'];
        $parentFolderID = $_SESSION["cur"]["curFolderID"];
        delDate($fileID,$fileType,$parentFolderID);
        break;


    case"showCurFolder":
        showCurFolder();
        break;

    case"breadcrumbFresh":
        breadcrumbFresh();
        break;


    case"enterFolder":
        $folderID = $_GET['folderID'];
        enterFolder ($folderID);
        break;

    case"freshUserInformation":
        freshUserInformation();
        break;

    case"isFolder":
        $fileID = $_GET['fileID'];
        isFolderAjax($fileID);
        break;

    case"getFileInner":
        $fileID = $_GET['fileID'];
        getFileInner($fileID);
        break;

    case"changeFileInner":
        $fileID = $_GET['fileID'];
        changeFileInner($fileID);
        break;

    case"lockUnlock":
        $fileID = $_GET['fileID'];
        lockUnlock($fileID);
        break;

    case"loginOut":
        loginOut();
        break;

    case"register":
        $userName = $_POST['userName'];
        $passWord = $_POST['passWord'];
        register($userName,$passWord);
        break;

    case"showStorgePanel":
        showStorgePanel();
        break;

    case"saveUser":
        saveUser();
        break;

    case "default":
        echo "string";
        break;
}
?>