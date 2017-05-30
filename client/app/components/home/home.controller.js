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
        this.getCountriesAndStates();

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

        this.$scope.mainOrderHasShipping = false;
        this.$scope.globalGrind = {
            id: 0,
            name: 'Reset all grinds to...'
        };
        this.$scope.preferredCourier = "-- None --";

        this.$scope.couriers = [this.$scope.preferredCourier, 'FedEx', 'Aramex', 'Bluedart', 'IndiaPost'];
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
            if (this.$scope.subscriptionItems.length < this.$scope.order.orderItems.length) {
                this.$scope.mainOrderHasShipping = true;
            }
        }, (error) => {

        });
    }

    getCoffees() {
        this.$http.get('/api/patrons/limitedCoffeeList').then((response) => {
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
        this.$scope.childOrders.forEach(c => {
            c.orderItems[0].product.subItems = c.orderItems[0].product.subItems.filter(si => {
                return si.type == 'coffee';
            });
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
                    if (response && response.data && response.data.length > 0) {
                        this.processDeliveries(response);
                    }
                    alert("Order successfully updated.");
                },
                (error) => {
                    alert("Error while updating order details.");
                });
    }

    updateFrequency(orderItem, frm) {
        if (confirm("This will update the roast dates on all unfulfilled deliveries. Proceed?")) {
            this.$http.post('/api/patrons/updateFrequencyForOrder?lineItemId=' + orderItem.shopifyId, orderItem.product.selectedFrequency)
                .then((response) => {
                    this.processDeliveries(response);
                    frm.freqSel.$setPristine();
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
            showingClass: "modal-open",
            controller: ['$modal', 'input', 'addresses', '$scope', 'countries', function ($modal, input, addresses, $scope, countries) {
                var ctrl = this;
                $scope.address = input;
                var cityName = $scope.address.city.cityName;
                $scope.addresses = addresses;
                $scope.countries = countries;

                ctrl.useThis = function (address) {
                    $scope.address = address;
                };
                ctrl.save = function () {
                    if (cityName != $scope.address.city.cityName) {
                        $scope.address.city.id = null;
                        // $scope.address.id = null;
                    }
                    $modal.close($scope.address);
                };
                ctrl.clickClose = function () {
                    $modal.close(null);
                };
            }],
            controllerAs: 'ctrl',
            inputs: {
                input: JSON.parse(JSON.stringify(childOrder.shippingAddress)),
                addresses: this.$scope.addresses,
                countries: this.$scope.countries
            }
        }).then((modal) => {
            modal.result.then((address) => {
                if (address != null) {
                    console.log(address);
                    childOrder.shippingAddress = address;
                    this.updateOrder(childOrder);
                }
            })
        });
    }

    getMyAddresses() {
        this.$http.get('/api/patrons/myaddresses').then((response) => {
            this.$scope.addresses = response.data;

            // this.$scope.addresses.push(JSON.parse(JSON.stringify(response.data[0])));
            // this.$scope.addresses.push(JSON.parse(JSON.stringify(response.data[0])));
            // this.$scope.addresses.push(JSON.parse(JSON.stringify(response.data[0])));
            // this.$scope.addresses.push(JSON.parse(JSON.stringify(response.data[0])));
        })
    }

    getCountriesAndStates() {
        this.$http.get('/api/patrons/getCountriesAndTheirStates').then(response => {
            this.$scope.countries = response.data;
        })
    }

    togglePause(orderItem) {
        let pause = orderItem.paused ? 'false' : 'true';
        this.$http.post('/api/patrons/pauseGeneratedOrder?lineItemId=' + orderItem.shopifyId + '&isPause=' + pause, orderItem.product.selectedFrequency)
            .then((response) => {
                this.processDeliveries(response);
                alert('Subscription has been ' + (orderItem.paused ? 'resumed.' : 'paused.'));
                orderItem.paused = !orderItem.paused;
            });
    }

    setPreferredCourier(courier) {
        this.$http.post('/api/patrons/setPreferredCourier?preferredCourier=' + courier + '&appCustomerId=' + this.$scope.order.customer.id)
            .then(res => {
                alert('Your preferred courier set to ' + courier);
                this.$scope.commonForm.preferredCourier.$setPristine();
            }, () => {
                alert('Failed to set preferred courier');
            });
    }

    setGlobalGrind(grind, orderItemShopifyId, frm) {
        this.$http.post('/api/patrons/changeGrindForAllDelivery?grindId=' + grind.id + '&orderItemShopifyId=' + orderItemShopifyId)
            .then((res) => {
                frm.globalGrind.$setPristine();
                alert('Grind of all unfulfilled deliveries updated to ' + grind.name + '.');
                this.getGeneratedOrders();
            })
    }
}

export default HomeController;
