import { generateUser, generateProduct } from '../utils/mock.utils.js';

import * as userService from '../services/user.service.js';
import * as productService from '../services/product.service.js';

export const getMockingUsers = (req, res) => {
  const users = Array.from({ length: 50 }, generateUser);
  res.json({
    message: '50 usuarios generados con éxito',
    data: users,
  });
};

export const getMockingProducts = (req, res) => {
  const products = Array.from({ length: 50 }, generateProduct);
  res.json({
    message: '50 productos generados con éxito',
    data: products,
  });
};

export const generateAndInsertData = async (req, res) => {
  try {
    const { users: numUsers = 10, products: numProducts = 20 } = req.query;
    
    const usersLength = Math.max(0, parseInt(numUsers, 10) || 0);
    const productsLength = Math.max(0, parseInt(numProducts, 10) || 0);
    
    const usersToCreate = Array.from({ length: usersLength }, generateUser);
    const productsToCreate = Array.from({ length: productsLength }, generateProduct);
    const createdUsers = await userService.createManyUsers(usersToCreate);
    const createdProducts = await productService.createManyProducts(productsToCreate);

    res.status(201).json({
      message: 'Datos generados e insertados con éxito.',
      payload: {
        users: createdUsers.length,
        products: createdProducts.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar o insertar datos', error: error.message });
  }
};