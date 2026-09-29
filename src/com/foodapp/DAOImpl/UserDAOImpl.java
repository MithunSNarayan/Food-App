package com.foodapp.DAOImpl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.foodapp.DAO.UserDAO;
import com.foodapp.model.User;
import com.foodapp.util.DBConnection;

public class UserDAOImpl implements UserDAO {

	private static final String INSERT_QUERY = "INSERT into user(name, email, password, phone, role, address, createdDate, lastloginDate) "
			+ "values(?,?,?,?,?,?,?,?)";
	
	private static final String SELECT_QUERY = "SELECT * FROM user where id= ? ";
	
	private static final String UPDATE_QUERY ="UPDATE user SET name=?, email=?, password=?, phone=?, role=?, address=? WHERE id=?";
	
	private static final String DELETE_QUERY ="DELETE FROM user WHERE id = ?";
	
	private static final String SELETEALL_QUERY="SELECT * FROM user";

	@Override
	public void addUser(User user) {
		Connection connection=null;
		
		connection = DBConnection.getConnection();
		
		try {
			PreparedStatement pstmt = connection.prepareStatement(INSERT_QUERY);
			pstmt.setString(1, user.getName());
			pstmt.setString(2, user.getEmail());
			pstmt.setString(3, user.getPassword());
			pstmt.setString(4, user.getPhone());
			pstmt.setString(5, user.getRole());
			pstmt.setString(6, user.getAddress());
			pstmt.setTimestamp(7,new Timestamp(System.currentTimeMillis()));
			pstmt.setTimestamp(8,new Timestamp(System.currentTimeMillis()));
			
			int i=pstmt.executeUpdate();
			System.out.println(i);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}

	@Override
	public User getUser(int id) {
	
		
		User user=null;
		
		
		try(Connection connection = DBConnection.getConnection();
			
			PreparedStatement pstmt=connection.prepareStatement(SELECT_QUERY);){
			
			pstmt.setInt(1, id);
			
			ResultSet result=pstmt.executeQuery();
			
			user= exractUsersResultSet(result);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return user;
	}

	
	@Override
	public void updateUser(User user) {
		
		Connection connection = DBConnection.getConnection();
		
		try {
			PreparedStatement pstmt=connection.prepareStatement(UPDATE_QUERY);
			
			pstmt.setString(1, user.getName());
			pstmt.setString(2, user.getEmail());
			pstmt.setString(3, user.getPassword());
			pstmt.setString(4, user.getPhone());
			pstmt.setString(5, user.getRole());
			pstmt.setString(6, user.getAddress());
			pstmt.setInt(7, user.getId());
			
			int i=pstmt.executeUpdate();
			System.out.print(i+" row effected");
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void deleteUser(int id){
		
		try(Connection connection = DBConnection.getConnection();
			PreparedStatement pstmt = connection.prepareStatement(DELETE_QUERY);){
			pstmt.setInt(1,id);
			int i =pstmt.executeUpdate();
			System.out.print(i+" row deleted");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}

	@Override
	public List<User> getAllUsers(User user) {
		List<User> al=null;
		Connection connection = DBConnection.getConnection();
		try {
			PreparedStatement pstm =  connection.prepareStatement(SELETEALL_QUERY);
			ResultSet result = pstm.executeQuery();
			
			al =exractAllUserResultSet(result);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return al;
	}
	
	private List<User> exractAllUserResultSet(ResultSet res) throws SQLException {
		
		List<User> al = new ArrayList<User>();
		User user = null;
		
		while(res.next()) {
			int id = res.getInt(1);
			String name = res.getString(2);
			String email = res.getString(3);
			String password = res.getString(4);
			String phone = res.getString(5);
			String role = res.getString(6);
			String address = res.getString(7);
			Timestamp createDate = res.getTimestamp(8);
			Timestamp lastLoginDate = res.getTimestamp(8);
			
			user = new User(id,name,email,password,phone,role,address,createDate,lastLoginDate);
			al.add(user);
		}
		return al;
	}

	private User exractUsersResultSet(ResultSet res) throws SQLException {
		
		User user=null;
		while(res.next()) {
			int id = res.getInt(1);
			String name = res.getString(2);
			String email = res.getString(3);
			String password = res.getString(4);
			String phone = res.getString(5);
			String role = res.getString(6);
			String address = res.getString(7);
			Timestamp createDate = res.getTimestamp(8);
			Timestamp lastLoginDate = res.getTimestamp(8);
			
			 user = new User(id,name,email,password,phone,role,address,createDate,lastLoginDate); 
		}
		return user;
	}
}