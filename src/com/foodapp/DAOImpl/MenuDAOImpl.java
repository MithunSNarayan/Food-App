package com.foodapp.DAOImpl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.foodapp.DAO.MenuDAO;
import com.foodapp.model.Menu;
import com.foodapp.util.DBConnection;

public class MenuDAOImpl implements MenuDAO {

    private static final String INSERT_QUERY =
            "INSERT INTO menu(RestaurantID, ItemName, Description, Price, "
            + "IsAvailable, Category, CreatedAt, UpdatedAt) "
            + "VALUES(?,?,?,?,?,?,?,?)";

    private static final String SELECT_QUERY =
            "SELECT * FROM menu WHERE MenuID=? AND DeletedAt IS NULL";

    private static final String UPDATE_QUERY =
            "UPDATE menu SET ItemName=?, Description=?, Price=?, "
            + "IsAvailable=?, Category=?, UpdatedAt=? "
            + "WHERE MenuID=? AND DeletedAt IS NULL";

    private static final String DELETE_QUERY =
            "UPDATE menu SET DeletedAt=? WHERE MenuID=?";

    private static final String SELECTALL_QUERY =
            "SELECT * FROM menu WHERE DeletedAt IS NULL";


    // ADD MENU
    @Override
    public void addMenu(Menu menu) {

        Connection connection = DBConnection.getConnection();

        try {

            PreparedStatement pstmt =
                    connection.prepareStatement(INSERT_QUERY);

            pstmt.setInt(1, menu.getRestaurantID());
            pstmt.setString(2, menu.getItemName());
            pstmt.setString(3, menu.getDescription());
            pstmt.setDouble(4, menu.getPrice());
            pstmt.setInt(5, menu.getIsAvailable());
            pstmt.setString(6, menu.getCategory());

            Timestamp currentTime =
                    new Timestamp(System.currentTimeMillis());

            pstmt.setTimestamp(7, currentTime);
            pstmt.setTimestamp(8, currentTime);

            int i = pstmt.executeUpdate();

            System.out.println(i + " row inserted");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    
    

    // GET MENU
    @Override
    public Menu getMenu(int menuID) {

        Menu menu = null;

        try (
            Connection connection = DBConnection.getConnection();
            PreparedStatement pstmt =
                    connection.prepareStatement(SELECT_QUERY)
        ) {

            pstmt.setInt(1, menuID);

            ResultSet result = pstmt.executeQuery();

            menu = extractMenuResultSet(result);

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return menu;
    }


    // UPDATE MENU
    @Override
    public void updateMenu(Menu menu) {

        Connection connection = DBConnection.getConnection();

        try {

            PreparedStatement pstmt =
                    connection.prepareStatement(UPDATE_QUERY);

            pstmt.setString(1, menu.getItemName());
            pstmt.setString(2, menu.getDescription());
            pstmt.setDouble(3, menu.getPrice());
            pstmt.setInt(4, menu.getIsAvailable());
            pstmt.setString(5, menu.getCategory());

            pstmt.setTimestamp(
                    6,
                    new Timestamp(System.currentTimeMillis())
            );

            pstmt.setInt(7, menu.getMenuID());

            int i = pstmt.executeUpdate();

            System.out.println(i + " row updated");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    // DELETE MENU - SOFT DELETE
    @Override
    public void deleteMenu(int menuID) {

        Connection connection = DBConnection.getConnection();

        try {

            PreparedStatement pstmt =
                    connection.prepareStatement(DELETE_QUERY);

            pstmt.setTimestamp(
                    1,
                    new Timestamp(System.currentTimeMillis())
            );

            pstmt.setInt(2, menuID);

            int i = pstmt.executeUpdate();

            System.out.println(i + " row deleted");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    // GET ALL MENUS
    @Override
    public List<Menu> getAllMenus(Menu menu) {

        List<Menu> al = new ArrayList<Menu>();

        Connection connection = DBConnection.getConnection();

        try {

            PreparedStatement pstmt =
                    connection.prepareStatement(SELECTALL_QUERY);

            ResultSet result = pstmt.executeQuery();

            al = extractAllMenuResultSet(result);

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return al;
    }


    // EXTRACT ALL MENUS
    private List<Menu> extractAllMenuResultSet(ResultSet res)
            throws SQLException {

        List<Menu> al = new ArrayList<Menu>();

        while (res.next()) {

            int menuID = res.getInt(1);
            int restaurantID = res.getInt(2);
            String itemName = res.getString(3);
            String description = res.getString(4);
            double price = res.getDouble(5);
            int isAvailable = res.getInt(6);
            String category = res.getString(7);
            Timestamp createdAt = res.getTimestamp(8);
            Timestamp updatedAt = res.getTimestamp(9);
            Timestamp deletedAt = res.getTimestamp(10);

            Menu menu = new Menu(
                    menuID,
                    restaurantID,
                    itemName,
                    description,
                    price,
                    isAvailable,
                    category,
                    createdAt,
                    updatedAt,
                    deletedAt
            );

            al.add(menu);
        }

        return al;
    }


    // EXTRACT SINGLE MENU
    private Menu extractMenuResultSet(ResultSet res)
            throws SQLException {

        Menu menu = null;

        if (res.next()) {

            int menuID = res.getInt(1);
            int restaurantID = res.getInt(2);
            String itemName = res.getString(3);
            String description = res.getString(4);
            double price = res.getDouble(5);
            int isAvailable = res.getInt(6);
            String category = res.getString(7);
            Timestamp createdAt = res.getTimestamp(8);
            Timestamp updatedAt = res.getTimestamp(9);
            Timestamp deletedAt = res.getTimestamp(10);

            menu = new Menu(
                    menuID,
                    restaurantID,
                    itemName,
                    description,
                    price,
                    isAvailable,
                    category,
                    createdAt,
                    updatedAt,
                    deletedAt
            );
        }

        return menu;
    }
}