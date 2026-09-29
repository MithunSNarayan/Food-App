package com.foodapp.util;

import com.foodapp.DAOImpl.UserDAOImpl;
import com.foodapp.model.User;

public class Test {
	
	public static void main(String[] args) {
		User user = new User("rajesh","rajesh@gamil.com","rajesh123","458673212","customer","BTM");
		UserDAOImpl u1 = new UserDAOImpl();
		u1.addUser(user);
		
		
	}
}
