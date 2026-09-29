package com.foodapp.DAO;

import java.util.List;

import com.foodapp.model.Orders;

public interface OrderDAO {
	void addOrder(Orders order);

	Orders getOrder(int orderID);

	void updateOrder(Orders order);

	void deleteOrder(int orderID);

	List<Orders> getAllOrders(Orders order);

}
