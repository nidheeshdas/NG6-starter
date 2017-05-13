class HomeController {
    /*@ngInject*/

    constructor($scope, $http) {
        this.name = 'home';
        this.$http = $http;
        this.$scope = $scope;

        this.getOrderDetails();
        this.getCoffees();
        this.getGrinds();
        this.getGeneratedOrders();
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
                v.processedAt = new Date(v.processedAt);
            })
        });
    }

    updateOrder(order) {
        this.$http.put('/api/patrons/orders', order)
            .then((response) => {
                    alert("Order successfully updated.");
                },
                (error) => {
                    alert("Error while updating order details.");
                });
    }

}

export default HomeController;
