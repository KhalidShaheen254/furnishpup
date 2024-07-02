# -*- coding: utf-8 -*-

from odoo import models, fields, api


class ProductProductInherit(models.Model):
    _inherit = 'product.product'

    def get_available_quantity(self, session_id):
        stock_location = self.env['pos.session'].browse([session_id]).config_id.picking_type_id.default_location_src_id
        available_quantity = self.env['stock.quant']._get_available_quantity(self, stock_location)
        return available_quantity

    def current_available_quantity(self, session_id):
        session = self.env['pos.session'].browse([session_id])
        product = self
        domain = [
            ('product_id', '=', product.id),
            ('order_id.session_id', '=', session.id),
            ('order_id.state', '=', 'paid'),
        ]
        available_qty = self.env['pos.order.line'].search_read(domain, ['qty'])
        current_available_qty = sum([rec['qty'] for rec in available_qty]) if available_qty else 0
        # print("current_available_qty: ", current_available_qty)
        return current_available_qty

    def set_not_available_in_pos(self):
        self.available_in_pos = False


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _loader_params_product_product(self):
        result = super()._loader_params_product_product()
        result['search_params']['fields'].append('qty_available')
        return result
