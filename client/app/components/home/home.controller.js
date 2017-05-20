import addressDialogTemplate from "./address-dialog.html!text";

class HomeController {
    /*@ngInject*/

    static get $inject() {
        return ['$scope', '$http', '$filter', 'ModalService'];
    }

    constructor($scope, $http, $filter, ModalService) {
        this.name = 'home';
        this.$http = $http;
        this.$scope = $scope;
        this.$filter = $filter;
        this.ModalService = ModalService;

        this.getOrderDetails();
        this.getCoffees();
        this.getGrinds();
        this.getGeneratedOrders();
        this.getMyAddresses();

        this.$scope.today = new Date();
        this.$scope.subscriptionItems = [];
        this.$scope.frequencies = {
            "Every 10 Days": "Every 10 Days",
            "Every Week": "Every Week",
            "Once a Month": "Once a Month",
            "Every other Week": "Every other Week",
            "Every 3 Weeks": "Every 3 Weeks",
            "Every 4 Weeks": "Every 4 Weeks",
            "EVERYROASTDAY": "Every Roast Day"
        };
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
            this.$scope.subscriptionItems = this.$scope.order.orderItems.filter(function (orderItem) {
                return orderItem.product.productType == 'SubscriptionProduct';
            });

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
            this.processDeliveries(response);
        });
    }

    processDeliveries(response) {
        this.$scope.childOrders = response.data;
        this.$scope.childOrders.sort(function (a, b) {
            return a.ordinal - b.ordinal;
        });
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

    updateFrequency(orderItem) {
        if (confirm("This will update the roast dates on all unfulfilled deliveries. Proceed?")) {
            this.$http.post('/api/patrons/updateFrequencyForOrder?lineItemId=' + orderItem.shopifyId, orderItem.product.selectedFrequency)
                .then((response) => {
                    this.processDeliveries(response);
                    alert('Subscription frequency updated.');
                });
        }
    }

    updateInstructions() {
        this.$http.post('/api/patrons/updateInstructionForOrder?shopifyId=' + this.$scope.order.shopifyId, this.$scope.order.instruction)
            .then((response) => {
                alert("Instructions updated.");
                console.log(response);
            })
    }

    openAddressEditor(childOrder) {
        this.ModalService.showModal({
            template: addressDialogTemplate,
            controller: ['$modal', 'address', 'addresses', function ($modal, address, addresses) {
                var ctrl = this;
                ctrl.address = address;
                var cityName = ctrl.address.city.cityName;
                ctrl.addresses = addresses;
                ctrl.save = function () {
                    if (cityName != ctrl.address.city.cityName) {
                        ctrl.address.city.id = null;
                    }
                    $modal.close(ctrl.address);
                };
                ctrl.clickClose = function () {
                    $modal.close(null);
                };
            }],
            controllerAs: 'ctrl',
            inputs: {
                address: JSON.parse(JSON.stringify(childOrder.shippingAddress)),
                addresses: this.$scope.addresses
            }
        }).then((modal) => {
            modal.result.then((address) => {
                if (address != null) {
                    console.log(address);
                    this.$scope.order.shippingAddress = address;
                    this.updateOrder(this.$scope.order);
                }
            })
        });
    }

    getMyAddresses() {
        this.$http.get('/api/patrons/myaddresses').then((response) => {
            this.$scope.addresses = response.data;
        })
    }
}

export default HomeController;
