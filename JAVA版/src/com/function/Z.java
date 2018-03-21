package com.function;


import java.awt.geom.RectangularShape;
import java.lang.reflect.Type;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.omg.CORBA.Request;

import com.data.Cur;
import com.data.File_detail;
import com.data.Folder_relationship;
import com.data.User;
import com.debug.C;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.servelet.Server;



public class Z {
	//以下为session里存储结构宏定义，替换显示2维数组，用于表意化编程。
	final static int curUser = 0;
		final static int folderNum = 0;
		final static int fileNum = 1;
		final static int name = 2;
		final static int storageMAX = 3;
	final static int curFolderID = 1;
	final static int curFolderOwner = 2;
	final static int curFileNameArr = 3;
	final static int curFoloderFileArr = 4;	
		final static int fileID = 0;
		final static int fileName = 1;
		final static int fileOwner = 2;
		final static int fileType = 3;
		final static int fileCreateTime = 4;
		final static int isLocked = 5;
	final static int breadcrumbStack = 5;

	
	
  int[] a =new int[Z.name];
	static public Connection link;
	public Connection dbConnect(){
		Connection conn = null;
		try {
			Class.forName("com.mysql.jdbc.Driver");
			String url="jdbc:mysql://localhost:3306/file_system?useUnicode=true&characterEncoding=UTF-8";
			String username="root";
			String password="root";
			conn=DriverManager.getConnection(url,username,password);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return conn;
	}
	
	private static List<?> convertList(ResultSet rs,int flag) throws SQLException {
		
		switch(flag){
		case 1:
			
			List<User> list = new ArrayList<User>();
			
			while(rs.next()){
				User p = new User();
				p.setPassword(rs.getString("Password"));
				p.setName(rs.getString("Name"));
				p.setStorageMAX(rs.getInt("StorageMAX"));
				p.setFileNum(rs.getInt("FileNum"));				
				p.setFolderNum(rs.getInt("FolderNum"));
				list.add(p);
			}

			 return list;
		case 2:
			List<Folder_relationship> list2 = new ArrayList<Folder_relationship>();
			while(rs.next()){
				Folder_relationship p = new Folder_relationship();
				p.setChildrenFileIDArr(rs.getString("childrenFileIDArr"));
				p.setFileID(rs.getInt("fileId"));
				p.setParentFolderID(rs.getInt("parentFolderID"));			
				list2.add(p);
			}
		    return list2;
		    
		case 3:
			List<File_detail> list3 = new ArrayList<File_detail>();
			while(rs.next()){
				File_detail p = new File_detail();
				p.setFileName(rs.getString("fileName"));
				p.setFileID(rs.getInt("fileId"));
				p.setFileOwner(rs.getString("fileOwner"));
				p.setFileType(rs.getInt("flag"));
				p.setFileCreateTime(rs.getString("fileCreateTime"));
				list3.add(p);
			}
			return list3;
		default: return null;
		}

		}
	/*
	 * 执行sql语句，可按需求返回结果
	 * */
	public List<?> mysql_query(String str,int ifreturn,int flag){
		List<?> p = null;
		try {
			
			PreparedStatement ps = link.prepareStatement(str);
			C.c(str);
			if(ifreturn!=1)
			{ps.executeUpdate();}
			else 
			{ ResultSet rs = ps.executeQuery();			  
			 p =convertList(rs,flag);
			}
			ps.close();
		    
		    
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return p;
		
	}
	//数据库操作
	public List<?> dbSelect(String table,String par ,String condition,int flag)
	{
		String str = "SELECT "+par+" FROM "+table+" WHERE "+condition;
		return mysql_query(str,1,flag);
		
	}
	

	public List<?> dbSelectOne(String table,String condition,int flag)
	{
		String str = "SELECT * FROM "+table+" WHERE "+condition+"LIMIT 1";
		return mysql_query(str,1,flag);
		
	}
	
	
	public List<?> dbAdd (String table,String valueStr,int flag)
	{
		String str = "INSERT INTO  "+table+" VALUE ("+valueStr+")";
		return mysql_query(str,0,flag);		
	}
	
	public List<?> dbdel (String table,String checkName,String value,int flag)
	{		
		String str = "DELETE FROM "+table+" WHERE `"+checkName+"` = '"+value+"' ";
		return  mysql_query(str,0,flag);		
	} 
	
	public List<?> dbChange (String table,String checkName,String value,String changeName,String newValue,int flag)
	{		
		String str = "UPDATE "+table+" SET "+checkName+" = \""+value+"\" WHERE "+changeName+" = "+newValue;
		return  mysql_query(str,0,flag);		
	}
	
	public String login(String username,String password,HttpServletRequest request){
		HttpSession session = request.getSession();
		List<User> temp =(List<User>) dbSelectOne("user","name='"+username+"'",1);
		Gson gson = new Gson(); 
		Map map = new HashMap();
		String json = null;
		for(User b : temp ){
			String tempPasword = b.getPassword();			
			if (tempPasword == null||tempPasword == password){
				map.put("msg", 1);//记得改回来！
				json = gson.toJson(map);
				  Cur cur = new Cur();
				  cur.setCurUserName(b.getName());
				  cur.setCurUserstorageMAX(b.getStorageMAX());
				  cur.setCurUserFileNum(b.getFileNum());
				  cur.setCurUserfolderNum(b.getFolderNum());
				  cur.setCurFolderID(0);
				  cur.setCurFolderOwner("admin");
				  session.setAttribute("cur", cur);
				  
//				  Cur cur2 = (Cur) request.getAttribute("cur");
//				  C.c(cur2.getCurUserName());
//				  C.c(cur2.getCurUserstorageMAX());
				C.c("登录成功");		
				C.c(cur.getCurFolderID());
				
			}
			else{
				request.setAttribute("cur", "");
				C.c("密码错误");
				map.put("msg", 0);
			}
			
		}
		return json;

	}
	public void aaa(HttpServletRequest request){
		Cur cur = (Cur) request.getAttribute("cur");
		C.c(cur.getCurFolderID());
	}
	public  void showCurFolder(HttpServletRequest request) {
		HttpSession session = request.getSession();
		// TODO 自动生成的方法存根
		C.c("开始调用显示文件夹");
		Cur cur = (Cur) session.getAttribute("cur");
		int curFolderID = cur.getCurFolderID();
		C.c("输出id为");
		C.c(curFolderID);
		List<Folder_relationship> temp =(List<Folder_relationship>) dbSelectOne("folder_relationship","fileID='"+curFolderID+"'",2);	
		for(Folder_relationship b : temp ){
//			cur.setCurFileNameArr(b.getf);
//			cur.setCurFoloderFileArr(curFoloderFileArr);
			C.c(b.getChildrenFileIDArr());
		}
		
		
//		$_SESSION["cur"]["curFileNameArr"] = array();;
//        $_SESSION["cur"]["curFoloderFileArr"] = array();
//        $curFolderID = $_SESSION['cur']['curFolderID'];
//        $temp = dbSelectOne("folder_relationship","fileID= $curFolderID");
//        $tempArr = charArrToArr($temp[0]['childrenFileIDArr']);
//        $fileArr = array();
//        foreach($tempArr as $value){//递归显示信息
//            $temp = dbSelectOne("file_detail","fileID = $value");
//            if(isset($temp[0])){
//                $fileArr[] =$temp[0];
//                $_SESSION["cur"]["curFileNameArr"][] = $temp[0]['fileName'];
//                $_SESSION["cur"]["curFoloderFileArr"][] = $temp[0];
//            }
//        }
//        echo json_encode($fileArr);
		
		
		
	}
	public String[] charArrToArr(String s){
		String[] empty = {};
		if(s == "")return empty; 
		return s.split(",");
		
	}
	public String arrTocharArr(String[] a){
		String temp = "";
		if(a==null)return temp; 
		for (int i = 0; i < a.length-1; i++) {
			temp += a[i]+",";		
		}
		temp += a[a.length-1];
		return temp;
		
	}
	public String[] delMeminArr(String[] a,String member){
		String temp = "";
		for (int i = 0; i < a.length-1; i++) {
			if(a[i]==member)continue;
			temp += a[i]+",";		
		}
		if(a[a.length-1]==member)
			temp = temp.substring(0, a.length-1);
		temp += a[a.length-1];

		return charArrToArr(temp);
		
	}
	public String[] charArrPush(String[] a,String member){
		String temp = "";
		for (int i = 0; i < a.length; i++) {
			if(a[i]==member)continue;
			temp += a[i]+",";		
		}
		temp += member;
		return charArrToArr(temp);
	}
	public String[] charArrDel(String temp,String member){
		
		String[] a = charArrToArr(temp);
		temp = "";
		for (int i = 0; i < a.length-1; i++) {
			if(a[i]==member)continue;
			temp += a[i]+",";		
		}
		if(a[a.length-1]==member)
			temp = temp.substring(0, a.length-1);
		temp += a[a.length-1];

		return charArrToArr(temp);
		
	}
	
}