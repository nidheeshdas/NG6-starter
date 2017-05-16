class HomeController {
    /*@ngInject*/

    constructor($scope, $http, $filter) {
        this.name = 'home';
        this.$http = $http;
        this.$scope = $scope;
        this.$filter = $filter;

        this.getOrderDetails();
        this.getCoffees();
        this.getGrinds();
        this.getGeneratedOrders();

        this.$scope.today = new Date();
    }

    getOrderDetails() {
        this.$http.get('/api/patrons/orders/getDetails', {
            params: {
                // shopifyOrderId : shopifyOrderId,
                // customerId : customerId,
                // email: email,
                // hash: hash
            }
        }).then((response) => {
            this.$scope.order = response.data;
        }, (error) => {

        });
    }

    getCoffees() {
        this.$http.get('/api/patrons/coffees').then((response) => {
            if (response.data)
                this.$scope.coffees = response.data;
        }, (error) => {
        });
    }

    getGrinds() {
        this.$http.get('/api/patrons/grinds').then((response) => {
            if (response.data)
                this.$scope.grinds = response.data;
        }, (error) => {
        });
    }

    getGeneratedOrders() {
        this.$http.get('/api/patrons/orders/getGeneratedOrdersByShopifyOrderId/?shopifyOrderId=' + window.api_params.shopifyOrderId).then((response) => {
            this.$scope.childOrders = response.data;
            angular.forEach(this.$scope.childOrders, (v, k) => {
                if (+new Date() > +new Date(v.processedAt)) {
                    v.fulfillment_status = 'fulfilled';
                }
                v.processedAt = this.$filter('date')(v.processedAt, 'MMMM d yyyy');
            });

            // test
            // {
            //    this.$scope.childOrders[0].fulfillments = [{
            //        trackingNumber: '#fskhdufsd',
            //        trackingUrl: 'https://google.com',
            //        trackingCompany: 'FedEx'
            //    }]
            // }
        });
    }

    updateOrder(order) {
        let v = JSON.parse(JSON.stringify(order));
        v.processedAt = new Date(order.processedAt + ' 15:30').toISOString();
        this.$http.put('/api/patrons/orders', v)
            .then((response) => {
                    alert("Order successfully updated.");
                },
                (error) => {
                    alert("Error while updating order details.");
                });
    }

}

export default HomeController;
