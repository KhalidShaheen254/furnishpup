# -*- coding: utf-8 -*-
{
    'name': "Hide Zero Stock Qty",

    'summary': "This module contains hide product zero stock quantity from pos products screen.",

    'description': """
        This module contains hide product zero stock quantity from pos products screen.
    """,

    'author': "Khalid Shaheen",
    'website': "+201552520894",
    'depends': ['base', 'point_of_sale'],
    'data': [
        'views/views.xml',
    ],
    "assets": {
        'point_of_sale._assets_pos': [
            'sha_pos_unload_zero_qty/static/src/js/Order.js',
            'sha_pos_unload_zero_qty/static/src/js/Receipt.js',
        ]
    },
}
