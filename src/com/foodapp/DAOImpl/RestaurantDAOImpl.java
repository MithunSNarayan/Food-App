package com.foodapp.DAOImpl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


import com.foodapp.DAO.RestaurantDAO;

import com.foodapp.model.Restaurant;
import com.foodapp.util.DBConnection;

public class RestaurantDAOImpl implements RestaurantDAO {

	
	private static final String INSERT_QUERY =
			"INSERT INTO restaurant(name, cuisineType, deliveryTime, address, adminUserID, rating, isActive) "
			+ "VALUES(?,?,?,?,?,?,?)";

	private static final String SELECT_QUERY =
			"SELECT * FROM restaurant WHERE restaurantID = ?";

	private static final String UPDATE_QUERY =
			"UPDATE restaurant SET name=?, cuisineType=?, deliveryTime=?, address=?, "
			+ "adminUserID=?, rating=?, isActive=? WHERE restaurantID=?";

	private static final String DELETE_QUERY =
			"DELETE FROM restaurant WHERE restaurantID = ?";

	private static final String SELETEALL_QUERY =
			"SELECT * FROM restaurant";
	
	
	@Override
	public void addRestaurant(Restaurant restaurant) {
		
		Connection connection = DBConnection.getConnection();

		try {

			PreparedStatement pstmt = connection.prepareStatement(INSERT_QUERY);

			pstmt.setString(1, restaurant.getName());
			pstmt.setString(2, restaurant.getCuisineType());
			pstmt.setInt(3, restaurant.getDeliveryTime());
			pstmt.setString(4, restaurant.getAddress());
			pstmt.setInt(5, restaurant.getAdminUserID());
			pstmt.setDouble(6, restaurant.getRating());
			pstmt.setInt(7, restaurant.isActive());

			int i = pstmt.executeUpdate();

			System.out.println(i);

		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}

	@Override
	public Restaurant getRestaurant(int restaurantID) {
		
		Restaurant restaurant = null;

		try (
				Connection connection = DBConnection.getConnection();
				PreparedStatement pstmt = connection.prepareStatement(SELECT_QUERY);
		) {

			pstmt.setInt(1, restaurantID);

			ResultSet result = pstmt.executeQuery();

			restaurant = extractRestaurantResultSet(result);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return restaurant;
	}

	@Override
	public void updateRestaurant(Restaurant restaurant) {
		
		Connection connection = DBConnection.getConnection();

		try {

			PreparedStatement pstmt = connection.prepareStatement(UPDATE_QUERY);

			pstmt.setString(1, restaurant.getName());
			pstmt.setString(2, restaurant.getCuisineType());
			pstmt.setInt(3, restaurant.getDeliveryTime());
			pstmt.setString(4, restaurant.getAddress());
			pstmt.setInt(5, restaurant.getAdminUserID());
			pstmt.setDouble(6, restaurant.getRating());
			pstmt.setInt(7, restaurant.isActive());

			pstmt.setInt(8, restaurant.getRestaurantID());

			int i = pstmt.executeUpdate();

			System.out.println(i + " row effected");

		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}

	@Override
	public void deleteRestaurant(int restaurantID) {
		
		try (
				Connection connection = DBConnection.getConnection();
				PreparedStatement pstmt = connection.prepareStatement(DELETE_QUERY);
		) {

			pstmt.setInt(1, restaurantID);

			int i = pstmt.executeUpdate();

			System.out.println(i + " row deleted");

		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	@Override
	public List<Restaurant> getAllRestaurants(Restaurant restaurant) {
		
		List<Restaurant> al = null;

		Connection connection = DBConnection.getConnection();

		try {

			PreparedStatement pstmt =
					connection.prepareStatement(SELETEALL_QUERY);

			ResultSet result = pstmt.executeQuery();

			al = extractAllRestaurantResultSet(result);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return al;
	}
	
	
	
	private List<Restaurant> extractAllRestaurantResultSet(ResultSet res) throws SQLException {
		List<Restaurant> al = new ArrayList<Restaurant>();

		Restaurant restaurant = null;

		while (res.next()) {

			int restaurantID = res.getInt(1);
			String name = res.getString(2);
			String cuisineType = res.getString(3);
			int deliveryTime = res.getInt(4);
			String address = res.getString(5);
			int adminUserID = res.getInt(6);
			double rating = res.getDouble(7);
			int isActive = res.getInt(8);

			restaurant = new Restaurant(restaurantID,name,cuisineType,deliveryTime,address,adminUserID,rating,isActive);

			al.add(restaurant);
		}

		return al;
	}

	private Restaurant extractRestaurantResultSet(ResultSet res)
			throws SQLException {

		Restaurant restaurant = null;

		while (res.next()) {

			int restaurantID = res.getInt(1);
			String name = res.getString(2);
			String cuisineType = res.getString(3);
			int deliveryTime = res.getInt(4);
			String address = res.getString(5);
			int adminUserID = res.getInt(6);
			double rating = res.getDouble(7);
			int isActive = res.getInt(8);

			restaurant = new Restaurant(restaurantID,name,cuisineType,deliveryTime,address,adminUserID,rating,isActive);
		}
		return restaurant;
	}
	
	
}
