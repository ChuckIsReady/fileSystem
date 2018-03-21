package com.servelet;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.debug.C;
import com.function.Z;
import com.google.gson.Gson;


/**
 * Servlet implementation class Server
 */
@WebServlet("/Server")
public class Server extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public Server() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String dodo = request.getParameter("dodo");
		String inAjax = request.getParameter("inAjax");
		C.c(dodo);
		if(inAjax.isEmpty()) return;
		
		HttpSession  session = request.getSession();
		Z F= new Z();
		Z.link=F.dbConnect(); //进入后连接数据库一次
		
		switch(dodo){
	
		case"showCurFolder":
	        F.showCurFolder(request);
	        break;	
	    default:
	    	C.c(dodo);
//	    	F.aaa(request);
	    	response.getWriter().append("接收到get请求："+dodo);
		}
		
		try {
			Z.link.close();//所有操作结束，关闭数据库
		} catch (SQLException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
		C.c("服务结束");
		
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String dodo = request.getParameter("dodo");
		String inAjax = request.getParameter("inAjax");
		C.c(dodo);
		if(inAjax.isEmpty()) return;
		
		HttpSession  session = request.getSession();
		Z F= new Z();
		Z.link=F.dbConnect(); //进入后连接数据库一次
		
		switch(dodo){
		
		case"login" :
			String username = request.getParameter("username");
			String password = request.getParameter("password");
			response.getWriter().append(F.login(username,password,request));
			break;

	    default:
	    	C.c(dodo);
		}
		
		try {
			Z.link.close();//所有操作结束，关闭数据库
		} catch (SQLException e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
		C.c("服务结束");
		}
	


}
