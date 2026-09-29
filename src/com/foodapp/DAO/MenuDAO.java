package com.foodapp.DAO;

import java.util.List;

import com.foodapp.model.Menu;

public interface MenuDAO {
	void addMenu(Menu menu);

	Menu getMenu(int menuID);

	void updateMenu(Menu menu);

	void deleteMenu(int menuID);

	List<Menu> getAllMenus(Menu menu);

}
