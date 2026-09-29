package com.foodapp.DAOImpl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.foodapp.DAO.OrderDAO;
import com.foodapp.model.Orders;
import com.foodapp.util.DBConnection;

public class OrderDAOImpl implements OrderDAO{
	private static final String INSERT_QUERY =
			"INSERT INTO orders(UserID, RestaurantID, OrderDate, TotalAmount, "
			+ "Status, PaymentMethod, Payment_Status) "
			+ "VALUES(?,?,?,?,?,?,?)";


	private static final String SELECT_QUERY =
			"SELECT * FROM orders WHERE OrderID = ?";


	private static final String UPDATE_QUERY =
			"UPDATE orders SET Status=?, PaymentMethod=?, Payment_Status=? "
			+ "WHERE OrderID=?";


	private static final String DELETE_QUERY =
			"DELETE FROM orders WHERE OrderID = ?";


	private static final String SELETEALL_QUERY =
			"SELECT * FROM orders";


	@Override
	public void addOrder(Orders order) {

		Connection connection = DBConnection.getConnection();

		try {

			PreparedStatement pstmt =
					connection.prepareStatement(INSERT_QUERY);

			pstmt.setInt(1, order.getUserID());

			pstmt.setInt(2, order.getRestaurantID());

			pstmt.setTimestamp(3,
					new Timestamp(System.currentTimeMillis()));

			pstmt.setDouble(4, order.getTotalAmount());

			pstmt.setString(5, order.getStatus());

			pstmt.setString(6, order.getPaymentMethod());

			pstmt.setString(7, order.getPaymentStatus());


			int i = pstmt.executeUpdate();

			System.out.println(i + " row inserted");

		} catch (SQLException e) {

			e.printStackTrace();
		}
	}


	@Override
	public Orders getOrder(int orderID) {

		Orders order = null;

		try (
				Connection connection = DBConnection.getConnection();

				PreparedStatement pstmt =
						connection.prepareStatement(SELECT_QUERY);
		) {

			pstmt.setInt(1, orderID);

			ResultSet result = pstmt.executeQuery();

			order = extractOrderResultSet(result);

		} catch (SQLException e) {

			e.printStackTrace();
		}

		return order;
	}


	@Override
	public void updateOrder(Orders order) {

		Connection connection = DBConnection.getConnection();

		try {

			PreparedStatement pstmt =
					connection.prepareStatement(UPDATE_QUERY);

			pstmt.setString(1, order.getStatus());

			pstmt.setString(2, order.getPaymentMethod());

			pstmt.setString(3, order.getPaymentStatus());

			pstmt.setInt(4, order.getOrderID());


			int i = pstmt.executeUpdate();

			System.out.println(i + " row effected");

		} catch (SQLException e) {

			e.printStackTrace();
		}
	}


	@Override
	public void deleteOrder(int orderID) {

		try (
				Connection connection = DBConnection.getConnection();

				PreparedStatement pstmt =
						connection.prepareStatement(DELETE_QUERY);
		) {

			pstmt.setInt(1, orderID);

			int i = pstmt.executeUpdate();

			System.out.println(i + " row deleted");

		} catch (SQLException e) {

			e.printStackTrace();
		}
	}


	@Override
	public List<Orders> getAllOrders(Orders order) {

		List<Orders> al = null;

		Connection connection = DBConnection.getConnection();

		try {

			PreparedStatement pstmt =
					connection.prepareStatement(SELETEALL_QUERY);

			ResultSet result = pstmt.executeQuery();

			al = extractAllOrderResultSet(result);

		} catch (SQLException e) {

			e.printStackTrace();
		}

		return al;
	}


	private List<Orders> extractAllOrderResultSet(ResultSet res)
			throws SQLException {

		List<Orders> al = new ArrayList<Orders>();

		while (res.next()) {

			int orderID = res.getInt(1);

			int userID = res.getInt(2);

			int restaurantID = res.getInt(3);

			Timestamp orderDate = res.getTimestamp(4);

			double totalAmount = res.getDouble(5);

			String status = res.getString(6);

			String paymentMethod = res.getString(7);

			String paymentStatus = res.getString(8);


			Orders order = new Orders(
					orderID,
					userID,
					restaurantID,
					orderDate,
					totalAmount,
					status,
					paymentMethod,
					paymentStatus
			);

			al.add(order);
		}

		return al;
	}


	private Orders extractOrderResultSet(ResultSet res)
			throws SQLException {

		Orders order = null;

		while (res.next()) {

			int orderID = res.getInt(1);

			int userID = res.getInt(2);

			int restaurantID = res.getInt(3);

			Timestamp orderDate = res.getTimestamp(4);

			double totalAmount = res.getDouble(5);

			String status = res.getString(6);

			String paymentMethod = res.getString(7);

			String paymentStatus = res.getString(8);


			order = new Orders(
					orderID,
					userID,
					restaurantID,
					orderDate,
					totalAmount,
					status,
					paymentMethod,
					paymentStatus
			);
		}

		return order;
	}

}
