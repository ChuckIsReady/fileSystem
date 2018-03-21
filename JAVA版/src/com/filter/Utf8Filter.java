package com.filter;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebInitParam;

/**
 * Servlet Filter implementation class CharactorFilter
 */
@WebFilter(filterName="Filter",urlPatterns="/*",
initParams={@WebInitParam(name="encoding",value="UTF-8")}
)
public class Utf8Filter implements Filter {
	String encoding=null;
    /**
     * Default constructor. 
     */
    public Utf8Filter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Utf8Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
		encoding=null;
	}

	/**
	 * @see Utf8Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		// place your code here

		// pass the request along the filter chain
		if(encoding!=null){
			request.setCharacterEncoding(encoding);
			response.setContentType("text/html;charset="+encoding);
		}
		chain.doFilter(request, response);
	}

	/**
	 * @see Utf8Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
		encoding=fConfig.getInitParameter("encoding");
	}
}
