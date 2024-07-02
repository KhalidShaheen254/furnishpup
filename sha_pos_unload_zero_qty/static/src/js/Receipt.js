/** @odoo-module **/

import { ReceiptScreen } from "@point_of_sale/app/screens/receipt_screen/receipt_screen";
import { patch } from "@web/core/utils/patch";

patch(ReceiptScreen.prototype, {

    setup() {
        super.setup(...arguments);
    },

    async setNotAvailableInPos(product_id) {
        await this.pos.orm.call("product.product", "set_not_available_in_pos", [product_id]);
    },

    async orderDone() {
        let call_super = true;
        let order = this.currentOrder
        let orderlines = order.get_orderlines();

        for (const line of orderlines) {
            if (line.product.type == 'product') {
                let available_pro_qty = await order.LineProductAvailableQty(line);
                let current_pro_qty = await order.LineProductCurrentAvailableQty(line);
                if (current_pro_qty == available_pro_qty){
                    this.pos.db.remove_products(line.product.id);
                    this.setNotAvailableInPos(line.product.id);
                }
            }
        }

        if (call_super){
            super.orderDone();
        }


    },

});