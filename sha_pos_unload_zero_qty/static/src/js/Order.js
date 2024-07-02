/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { Order } from "@point_of_sale/app/store/models";
import { ErrorPopup } from "@point_of_sale/app/errors/popups/error_popup";
import { _t } from "@web/core/l10n/translation";

patch(Order.prototype, {

    setup() {
        super.setup(...arguments);
    },

    async LineProductAvailableQty(line) {
        let session_id = this.pos.pos_session.id
        let qty = await this.pos.orm.call("product.product", "get_available_quantity", [line.product.id , session_id]);
        return qty
    },

    async LineProductCurrentAvailableQty(line) {
        let session_id = this.pos.pos_session.id
        let qty = await this.pos.orm.call("product.product", "current_available_quantity", [line.product.id , session_id]);
        return qty
    },

    async pay() {

        let call_super = true;
        let orderlines = this.get_orderlines()

        for (const line of orderlines) {
            if (line.product.type == 'product') {
                let available_pro_qty = await this.LineProductAvailableQty(line);
                let current_pro_qty = await this.LineProductCurrentAvailableQty(line);
                let allowed_qty = available_pro_qty - current_pro_qty
                if (line.quantity + current_pro_qty > available_pro_qty) {
                    call_super = false;
                    let warning = 'Available quantity for product ( ' + line.product.display_name + ' ) is ( ' + allowed_qty + ' )';
                    this.env.services.pos.popup.add(ErrorPopup, {
                       title: _t('Negative Quantity Not allowed'),
                       body: _t(warning),
                    });
                }
            }
        }

        ////////////////////////////////////////////////////////////////

        if (call_super){
            super.pay();
        }
    }


});