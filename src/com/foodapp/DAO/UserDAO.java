package com.foodapp.DAO;

import java.util.List;

import com.foodapp.model.User;

public interface UserDAO {

	void addUser(User user);
	User getUser(int userID);
	void updateUser(User user);
	void deleteUser(int id);
	List<User> getAllUsers(User user);
	
	
}
