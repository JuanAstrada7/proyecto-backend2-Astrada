import * as cartService from '../services/cart.service.js';
import { purchaseCart } from '../services/cart.service.js';

export const getCartById = async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.id);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener carrito' });
    }
};

export const createCart = async (req, res) => {
    try {
        const cart = await cartService.createCart({ user: req.user._id });
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear carrito' });
    }
};

export const updateCart = async (req, res) => {
    try {
        const cart = await cartService.updateCart(req.params.id, req.body);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar carrito' });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const cart = await cartService.deleteCart(req.params.id);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json({ message: 'Carrito eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar carrito' });
    }
};

export const buyCart = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const result = await purchaseCart(id, userId);
        if (!result.ticket) {
            return res.status(400).json({ message: 'No se pudo comprar ningún producto por falta de stock', notPurchased: result.notPurchased });
        }
        res.status(201).json({
            message: 'Compra realizada',
            ticket: result.ticket,
            notPurchased: result.notPurchased
        });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error al procesar la compra' });
    }
};
