package com.foodapp.model;

import java.sql.Timestamp;

public class Menu {
	private int menuID;
	private int restaurantID;
	private String itemName;
	private String description;
	private double price;
	private int isAvailable;
	private String category;
	private Timestamp createdAt;
	private Timestamp updatedAt;
	private Timestamp deletedAt;


	public Menu() {

	}


	public Menu(int restaurantID, String itemName, String description,
			double price, int isAvailable, String category) {

		this.restaurantID = restaurantID;
		this.itemName = itemName;
		this.description = description;
		this.price = price;
		this.isAvailable = isAvailable;
		this.category = category;
	}


	public Menu(int menuID, int restaurantID, String itemName,
			String description, double price, int isAvailable,
			String category, Timestamp createdAt,
			Timestamp updatedAt, Timestamp deletedAt) {

		this.menuID = menuID;
		this.restaurantID = restaurantID;
		this.itemName = itemName;
		this.description = description;
		this.price = price;
		this.isAvailable = isAvailable;
		this.category = category;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.deletedAt = deletedAt;
	}


	public int getMenuID() {
		return menuID;
	}

	public void setMenuID(int menuID) {
		this.menuID = menuID;
	}


	public int getRestaurantID() {
		return restaurantID;
	}

	public void setRestaurantID(int restaurantID) {
		this.restaurantID = restaurantID;
	}


	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}


	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}


	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}


	public int getIsAvailable() {
		return isAvailable;
	}

	public void setIsAvailable(int isAvailable) {
		this.isAvailable = isAvailable;
	}


	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}


	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}


	public Timestamp getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Timestamp updatedAt) {
		this.updatedAt = updatedAt;
	}


	public Timestamp getDeletedAt() {
		return deletedAt;
	}

	public void setDeletedAt(Timestamp deletedAt) {
		this.deletedAt = deletedAt;
	}


	@Override
	public String toString() {

		return "Menu [menuID=" + menuID
				+ ", restaurantID=" + restaurantID
				+ ", itemName=" + itemName
				+ ", description=" + description
				+ ", price=" + price
				+ ", isAvailable=" + isAvailable
				+ ", category=" + category
				+ ", createdAt=" + createdAt
				+ ", updatedAt=" + updatedAt
				+ ", deletedAt=" + deletedAt + "]";
	}
	
	
}