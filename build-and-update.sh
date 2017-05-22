#!/bin/bash

gulp build && aws s3 cp dist/app.min.js s3://btc-wp-content/btc-order-editor/appv2.min.js


