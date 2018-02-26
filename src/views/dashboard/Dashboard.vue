<template>
    <section class="chart-container">
        <el-row :gutter="20">
            <el-col :sm="12" :xs="12" :md="6" :lg="6" v-for="stat in dashboardStats" :key="stat.title">
                <div class="info-tiles has-footer" :class="stat.bodyCls" href="#">
                    <div class="tiles-heading">
                        {{ stat.title }}
                        <div class="pull-right">
                            <i :class="stat.iconCls"></i>
                        </div>
                    </div>
                    <div class="tiles-body text-center">
                       &nbsp;   {{ stat.value}}
                    </div>
                    <div class="tiles-footer" v-on:click="test">
                            View {{ stat.title }}
                        <div class="pull-right">+20.7%</div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :lg="24" :md="24" :sm="24" :xs="24">
                <el-card class="box-card">
                    <div id="chartLine" style="width:100%; height:400px;"></div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :lg="24" :md="24" :sm="24" :xs="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 24px;"><h3>Latest Orders</h3></span>
                        <!--<el-button style="float: right;" type="primary">Print</el-button>-->
                    </div>
                    <el-table :data="latestOrders" highlight-current-row style="width: 100%">
                        <el-table-column prop="created_at" label="Date" width="200">
                        </el-table-column>
                        <el-table-column prop="order_number" label="Order No." width="120">
                        </el-table-column>
                        <el-table-column prop="invoice_number" label="Invoice No." width="120">
                        </el-table-column>
                        <el-table-column prop="total" label="Amount" width="100">
                        </el-table-column>
                        <el-table-column prop="checkout_type_id" label="Checkout" width="150" :formatter="formatCheckoutType">
                        </el-table-column>
                        <el-table-column prop="customer.name" label="Customer" width="150">
                        </el-table-column>
                        <el-table-column prop="payment_type_id" label="Payment" width="120" :formatter="formatPaymentType">
                        </el-table-column>
                        <el-table-column prop="payment_reference" label="Payment Ref." width="130">
                        </el-table-column>
                        <el-table-column prop="status" label="Status" width="100" :formatter="formatOrderStatus">
                        </el-table-column>
                        <el-table-column label="Actions" width="100">
                            <template scope="scope">
                                <el-button size="small" type="info" @click="handleViewOrder(scope.$index, scope.row)">View Order</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col v-if="false" :lg="12" :md="24" :sm="24" :xs="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 24px;"><h3>Latest Customers</h3></span>
                        <!--<el-button style="float: right;" type="primary">Print</el-button>-->
                    </div>
                    <el-table :data="latestCustomers" highlight-current-row style="width: 100%">
                        <el-table-column prop="customer.name" label="Manufacturer" width="180">
                        </el-table-column>
                        <el-table-column prop="created_at" label="Date Registered" width="180">
                        </el-table-column>
                        <el-table-column prop="orders" label="Orders">
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :lg="12" :md="24" :sm="24" :xs="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 24px;"><h3>Bestsellers by quantity</h3></span>
                        <!--<el-button style="float: right;" type="primary">Print</el-button>-->
                    </div>
                    <el-table :data="bestSellersQuantity" highlight-current-row style="width: 100%">
                        <el-table-column prop="product.name" label="Product" width="180">
                        </el-table-column>
                        <el-table-column prop="name" label="Manufacturer" width="180">
                        </el-table-column>
                        <el-table-column prop="amount" label="Amount" width="150">
                        </el-table-column>
                        <el-table-column prop="quantity" label="Quantity" width="150">
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :lg="12" :md="24" :sm="24" :xs="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 24px;"><h3>Bestsellers by amount</h3></span>
                        <!--<el-button style="float: right;" type="primary">Print</el-button>-->
                    </div>
                    <el-table :data="bestSellersAmount" highlight-current-row style="width: 100%">
                        <el-table-column prop="product.name" label="Product" width="180">
                        </el-table-column>
                        <el-table-column prop="name" label="Manufacturer" width="180">
                        </el-table-column>
                        <el-table-column prop="amount" label="Amount" width="150">
                        </el-table-column>
                        <el-table-column prop="quantity" label="Quantity" width="150">
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts';
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import ElCard from "../../../node_modules/element-ui/packages/card/src/main";
    import {getDashboardReport} from "../../api/api";

    export default{
        components: {
            ElCard,
            ElCol,
            ElRow
        },
        name: 'dashboard',
        data() {
            return {
                chartLine: null,
                chartPie: null,
                latestOrders: [],
                latestCustomers: [],
                bestSellersQuantity: [],
                bestSellersAmount: [],
                dashboardStats: [],
                tableData: []
            }
        },
        methods: {
            handleViewOrder (index, row){
                this.$router.push(`/orders/${row.id}`)
            },
            formatOrderStatus (row, column) {
               if(row.order_status_id===0){
                   return 'Pending.'
               } else{
                   return 'Shipped.'
               }
            },
            formatPaymentType (row, column) {
                if(row.payment_type_id===0){
                    return 'Mobile.'
                } else{
                    return 'Card.'
                }
            },
            formatCheckoutType (row, column) {
                if(row.checkout_type_id===0){
                    return 'Guest.'
                } else{
                    return 'Returning User.'
                }
            },
            getDashboardReport(){
                getDashboardReport({}).then((res)=>{
                    console.log(res.data.data)
                    let data = res.data.data
                    this.bestSellersQuantity=data.bestseller_quantity;
                    this.bestSellersAmount=data.bestseller_amount;
                    this.latestOrders=data.latest_orders;
                    this.dashboardStats=data.stats;
                })
            },
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: 'Statistics'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['Sales', 'Orders', 'Stock']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['Last week', 'Yesterday', 'Today', '1', '2', '3', '4']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: 'Sales',
                            type: 'line',
                            stack: '总量',
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: 'Orders',
                            type: 'line',
                            stack: '总量',
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: 'Stock',
                            type: 'line',
                            stack: '总量',
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                });
            },
            drawCharts() {
                //this.drawColumnChart()
                //this.drawBarChart()
                this.drawLineChart();
                //this.drawPieChart()
            },
        },

        mounted: function () {
            this.drawCharts()
            this.getDashboardReport();
        },
        updated: function () {
            this.drawCharts()
        }
    }

</script>

<style lang="scss" scoped>
    @import '~scss_vars';

    .text {
        font-size: 14px;
    }

    .item {
        padding: 18px 0;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .stats-card {
        .primary {
            background: $color-primary;
            color: #fff;
        }
    }

    .box-card {
        margin-top: 24px;
        margin-bottom: 24px;
    }

    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .tiles-footer {
        cursor: hand;
    }
</style>
<style lang="css">
    .tiles-heading,
    .tiles-body,
    .tiles-footer {
        -webkit-transition: 0.05s ease-in;
        -o-transition: 0.05s ease-in;
        transition: 0.05s ease-in;
    }

    .info-tiles,
    .shortcut-tiles {
        margin: 0 0 20px;
        display: block;
        border-radius: 3px;
    }

    a.info-tiles,
    a.shortcut-tiles {
        background: none;
    }
    .info-tiles .tiles-heading {
        letter-spacing: 0.1em;
        padding: 6px 10px;
        border-top-right-radius: 3px;
        border-top-left-radius: 3px;
        text-transform: uppercase;
        text-align: left;
        vertical-align: top;
        font-size: 12px;
    }

    .info-tiles .tiles-body {
        font-size: 36px;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }

    .info-tiles.has-footer .tiles-body {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    .info-tiles .tiles-footer {
        color: #fff;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        padding: 6px 10px;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }

    .info-tiles:hover {
        text-decoration: none;
    }

    .info-tiles:hover i {
        color: #ffffff;
    }

    .info-tiles:hover .tiles-footer .pull-right,
    .info-tiles:hover .tiles-heading .pull-right {
        color: #fff;
    }

    /** Infotiles styling **/
    .info-tiles.tiles-info {
        color: #fff !important;
    }

    .info-tiles.tiles-info .tiles-heading {
        background: #58cbc2;
    }

    .info-tiles.tiles-info .tiles-body {
        background: #3bbfb4;
    }

    .info-tiles.tiles-info .tiles-body-alt {
        background: #3bbfb4;
    }

    .info-tiles.tiles-info .tiles-footer {
        background: #36afa5;
    }

    .info-tiles.tiles-info:hover {
        color: #fff;
    }

    .info-tiles.tiles-info:hover .tiles-heading {
        background: #40c4b9;
    }

    .info-tiles.tiles-info:hover .tiles-body {
        background: #35aca2;
    }

    .info-tiles.tiles-info:hover .tiles-body-alt {
        background: #35aca2;
    }

    .info-tiles.tiles-info:hover .tiles-footer {
        background: #309c93;
    }

    .info-tiles.tiles-success {
        color: #fff !important;
    }

    .info-tiles.tiles-success .tiles-heading {
        background: #4cd787;
    }

    .info-tiles.tiles-success .tiles-body {
        background: #2ecc71;
    }

    .info-tiles.tiles-success .tiles-body-alt {
        background: #2ecc71;
    }

    .info-tiles.tiles-success .tiles-footer {
        background: #2abb68;
    }

    .info-tiles.tiles-success:hover {
        color: #fff;
    }

    .info-tiles.tiles-success:hover .tiles-heading {
        background: #33d176;
    }

    .info-tiles.tiles-success:hover .tiles-body {
        background: #29b765;
    }

    .info-tiles.tiles-success:hover .tiles-body-alt {
        background: #29b765;
    }

    .info-tiles.tiles-success:hover .tiles-footer {
        background: #26a75c;
    }

    .info-tiles.tiles-danger {
        color: #fff !important;
    }

    .info-tiles.tiles-danger .tiles-heading {
        background: #eb6d60;
    }

    .info-tiles.tiles-danger .tiles-body {
        background: #e74c3c;
    }

    .info-tiles.tiles-danger .tiles-body-alt {
        background: #e74c3c;
    }

    .info-tiles.tiles-danger .tiles-footer {
        background: #e53b2a;
    }

    .info-tiles.tiles-danger:hover {
        color: #fff;
    }

    .info-tiles.tiles-danger:hover .tiles-heading {
        background: #e85445;
    }

    .info-tiles.tiles-danger:hover .tiles-body {
        background: #e43725;
    }

    .info-tiles.tiles-danger:hover .tiles-body-alt {
        background: #e43725;
    }

    .info-tiles.tiles-danger:hover .tiles-footer {
        background: #da2d1b;
    }

    .info-tiles.tiles-warning {
        color: #ffffff !important;
    }

    .info-tiles.tiles-warning .tiles-heading {
        background: #f3cd36;
    }

    .info-tiles.tiles-warning .tiles-body {
        background: #f1c40f;
    }

    .info-tiles.tiles-warning .tiles-body-alt {
        background: #f1c40f;
    }

    .info-tiles.tiles-warning .tiles-footer {
        background: #dfb50d;
    }

    .info-tiles.tiles-warning:hover {
        color: #fff;
    }

    .info-tiles.tiles-warning:hover .tiles-heading {
        background: #f2c619;
    }

    .info-tiles.tiles-warning:hover .tiles-body {
        background: #dab10d;
    }

    .info-tiles.tiles-warning:hover .tiles-body-alt {
        background: #dab10d;
    }

    .info-tiles.tiles-warning:hover .tiles-footer {
        background: #c7a10c;
    }

    .info-tiles.tiles-primary {
        color: #fff !important;
    }

    .info-tiles.tiles-primary .tiles-heading {
        background: #57aae1;
    }

    .info-tiles.tiles-primary .tiles-body {
        background: #3498db;
    }

    .info-tiles.tiles-primary .tiles-body-alt {
        background: #3498db;
    }

    .info-tiles.tiles-primary .tiles-footer {
        background: #268fd5;
    }

    .info-tiles.tiles-primary:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-primary:hover .tiles-heading {
        background: #3d9cdd;
    }

    .info-tiles.tiles-primary:hover .tiles-body {
        background: #258cd1;
    }

    .info-tiles.tiles-primary:hover .tiles-body-alt {
        background: #258cd1;
    }

    .info-tiles.tiles-primary:hover .tiles-footer {
        background: #2280bf;
    }

    .info-tiles.tiles-inverse {
        color: #fff !important;
    }

    .info-tiles.tiles-inverse .tiles-heading {
        background: #abb8b9;
    }

    .info-tiles.tiles-inverse .tiles-body {
        background: #95a5a6;
    }

    .info-tiles.tiles-inverse .tiles-body-alt {
        background: #95a5a6;
    }

    .info-tiles.tiles-inverse .tiles-footer {
        background: #8a9c9d;
    }

    .info-tiles.tiles-inverse:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-inverse:hover .tiles-heading {
        background: #9baaab;
    }

    .info-tiles.tiles-inverse:hover .tiles-body {
        background: #87999a;
    }

    .info-tiles.tiles-inverse:hover .tiles-body-alt {
        background: #87999a;
    }

    .info-tiles.tiles-inverse:hover .tiles-footer {
        background: #7c9091;
    }

    .info-tiles.tiles-midnightblue {
        color: #ffffff !important;
    }

    .info-tiles.tiles-midnightblue .tiles-heading {
        background: #435d78;
    }

    .info-tiles.tiles-midnightblue .tiles-body {
        background: #34495e;
    }

    .info-tiles.tiles-midnightblue .tiles-body-alt {
        background: #34495e;
    }

    .info-tiles.tiles-midnightblue .tiles-footer {
        background: #2d3f51;
    }

    .info-tiles.tiles-midnightblue:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-midnightblue:hover .tiles-heading {
        background: #384e65;
    }

    .info-tiles.tiles-midnightblue:hover .tiles-body {
        background: #2b3c4e;
    }

    .info-tiles.tiles-midnightblue:hover .tiles-body-alt {
        background: #2b3c4e;
    }

    .info-tiles.tiles-midnightblue:hover .tiles-footer {
        background: #243240;
    }

    .info-tiles.tiles-sky {
        color: #ffffff !important;
    }

    .info-tiles.tiles-sky .tiles-heading {
        background: #a4d4ed;
    }

    .info-tiles.tiles-sky .tiles-body {
        background: #82c4e6;
    }

    .info-tiles.tiles-sky .tiles-body-alt {
        background: #82c4e6;
    }

    .info-tiles.tiles-sky .tiles-footer {
        background: #71bce3;
    }

    .info-tiles.tiles-sky:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-sky:hover .tiles-heading {
        background: #8ac8e8;
    }

    .info-tiles.tiles-sky:hover .tiles-body {
        background: #6dbae2;
    }

    .info-tiles.tiles-sky:hover .tiles-body-alt {
        background: #6dbae2;
    }

    .info-tiles.tiles-sky:hover .tiles-footer {
        background: #5cb2de;
    }

    .info-tiles.tiles-orange {
        color: #ffffff !important;
    }

    .info-tiles.tiles-orange .tiles-heading {
        background: #ea9347;
    }

    .info-tiles.tiles-orange .tiles-body {
        background: #e67e22;
    }

    .info-tiles.tiles-orange .tiles-body-alt {
        background: #e67e22;
    }

    .info-tiles.tiles-orange .tiles-footer {
        background: #db7419;
    }

    .info-tiles.tiles-orange:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-orange:hover .tiles-heading {
        background: #e7832b;
    }

    .info-tiles.tiles-orange:hover .tiles-body {
        background: #d67118;
    }

    .info-tiles.tiles-orange:hover .tiles-body-alt {
        background: #d67118;
    }

    .info-tiles.tiles-orange:hover .tiles-footer {
        background: #c46816;
    }

    .info-tiles.tiles-indigo {
        color: #ffffff !important;
    }

    .info-tiles.tiles-indigo .tiles-heading {
        background: #9180c8;
    }

    .info-tiles.tiles-indigo .tiles-body {
        background: #7863bc;
    }

    .info-tiles.tiles-indigo .tiles-body-alt {
        background: #7863bc;
    }

    .info-tiles.tiles-indigo .tiles-footer {
        background: #6c55b6;
    }

    .info-tiles.tiles-indigo:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-indigo:hover .tiles-heading {
        background: #7e6abf;
    }

    .info-tiles.tiles-indigo:hover .tiles-body {
        background: #6951b4;
    }

    .info-tiles.tiles-indigo:hover .tiles-body-alt {
        background: #6951b4;
    }

    .info-tiles.tiles-indigo:hover .tiles-footer {
        background: #5f48a9;
    }

    .info-tiles.tiles-green {
        color: #ffffff !important;
    }

    .info-tiles.tiles-green .tiles-heading {
        background: #52cda0;
    }

    .info-tiles.tiles-green .tiles-body {
        background: #37bf8d;
    }

    .info-tiles.tiles-green .tiles-body-alt {
        background: #37bf8d;
    }

    .info-tiles.tiles-green .tiles-footer {
        background: #32af81;
    }

    .info-tiles.tiles-green:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-green:hover .tiles-heading {
        background: #3ac693;
    }

    .info-tiles.tiles-green:hover .tiles-body {
        background: #31ab7e;
    }

    .info-tiles.tiles-green:hover .tiles-body-alt {
        background: #31ab7e;
    }

    .info-tiles.tiles-green:hover .tiles-footer {
        background: #2d9b73;
    }

    .info-tiles.tiles-blue {
        color: #ffffff !important;
    }

    .info-tiles.tiles-blue .tiles-heading {
        background: #72a7d3;
    }

    .info-tiles.tiles-blue .tiles-body {
        background: #5394c9;
    }

    .info-tiles.tiles-blue .tiles-body-alt {
        background: #5394c9;
    }

    .info-tiles.tiles-blue .tiles-footer {
        background: #438ac4;
    }

    .info-tiles.tiles-blue:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-blue:hover .tiles-heading {
        background: #5b99cb;
    }

    .info-tiles.tiles-blue:hover .tiles-body {
        background: #4088c3;
    }

    .info-tiles.tiles-blue:hover .tiles-body-alt {
        background: #4088c3;
    }

    .info-tiles.tiles-blue:hover .tiles-footer {
        background: #397db5;
    }

    .info-tiles.tiles-magenta {
        color: #ffffff !important;
    }

    .info-tiles.tiles-magenta .tiles-heading {
        background: #eb6084;
    }

    .info-tiles.tiles-magenta .tiles-body {
        background: #e73c68;
    }

    .info-tiles.tiles-magenta .tiles-body-alt {
        background: #e73c68;
    }

    .info-tiles.tiles-magenta .tiles-footer {
        background: #e52a5a;
    }

    .info-tiles.tiles-magenta:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-magenta:hover .tiles-heading {
        background: #e8456f;
    }

    .info-tiles.tiles-magenta:hover .tiles-body {
        background: #e42556;
    }

    .info-tiles.tiles-magenta:hover .tiles-body-alt {
        background: #e42556;
    }

    .info-tiles.tiles-magenta:hover .tiles-footer {
        background: #da1b4c;
    }

    .info-tiles.tiles-purple {
        color: #ffffff !important;
    }

    .info-tiles.tiles-purple .tiles-heading {
        background: #e667bb;
    }

    .info-tiles.tiles-purple .tiles-body {
        background: #e044ab;
    }

    .info-tiles.tiles-purple .tiles-body-alt {
        background: #e044ab;
    }

    .info-tiles.tiles-purple .tiles-footer {
        background: #dd33a3;
    }

    .info-tiles.tiles-purple:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-purple:hover .tiles-heading {
        background: #e14daf;
    }

    .info-tiles.tiles-purple:hover .tiles-body {
        background: #dc2ea1;
    }

    .info-tiles.tiles-purple:hover .tiles-body-alt {
        background: #dc2ea1;
    }

    .info-tiles.tiles-purple:hover .tiles-footer {
        background: #d32397;
    }

    .info-tiles.tiles-brown {
        color: #ffffff !important;
    }

    .info-tiles.tiles-brown .tiles-heading {
        background: #d44e40;
    }

    .info-tiles.tiles-brown .tiles-body {
        background: #c0392b;
    }

    .info-tiles.tiles-brown .tiles-body-alt {
        background: #c0392b;
    }

    .info-tiles.tiles-brown .tiles-footer {
        background: #af3427;
    }

    .info-tiles.tiles-brown:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-brown:hover .tiles-heading {
        background: #c83b2d;
    }

    .info-tiles.tiles-brown:hover .tiles-body {
        background: #ab3326;
    }

    .info-tiles.tiles-brown:hover .tiles-body-alt {
        background: #ab3326;
    }

    .info-tiles.tiles-brown:hover .tiles-footer {
        background: #9a2e23;
    }

    .info-tiles.tiles-grape {
        color: #ffffff !important;
    }

    .info-tiles.tiles-grape .tiles-heading {
        background: #919bad;
    }

    .info-tiles.tiles-grape .tiles-body {
        background: #7a869c;
    }

    .info-tiles.tiles-grape .tiles-body-alt {
        background: #7a869c;
    }

    .info-tiles.tiles-grape .tiles-footer {
        background: #6e7b93;
    }

    .info-tiles.tiles-grape:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-grape:hover .tiles-heading {
        background: #808ba0;
    }

    .info-tiles.tiles-grape:hover .tiles-body {
        background: #6c7991;
    }

    .info-tiles.tiles-grape:hover .tiles-body-alt {
        background: #6c7991;
    }

    .info-tiles.tiles-grape:hover .tiles-footer {
        background: #636f85;
    }

    .info-tiles.tiles-toyo {
        color: #ffffff !important;
    }

    .info-tiles.tiles-toyo .tiles-heading {
        background: #677fa4;
    }

    .info-tiles.tiles-toyo .tiles-body {
        background: #556b8d;
    }

    .info-tiles.tiles-toyo .tiles-body-alt {
        background: #556b8d;
    }

    .info-tiles.tiles-toyo .tiles-footer {
        background: #4d6180;
    }

    .info-tiles.tiles-toyo:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-toyo:hover .tiles-heading {
        background: #597093;
    }

    .info-tiles.tiles-toyo:hover .tiles-body {
        background: #4b5f7d;
    }

    .info-tiles.tiles-toyo:hover .tiles-body-alt {
        background: #4b5f7d;
    }

    .info-tiles.tiles-toyo:hover .tiles-footer {
        background: #445570;
    }

    .info-tiles.tiles-alizarin {
        color: #ffffff !important;
    }

    .info-tiles.tiles-alizarin .tiles-heading {
        background: #e98a72;
    }

    .info-tiles.tiles-alizarin .tiles-body {
        background: #e36d4f;
    }

    .info-tiles.tiles-alizarin .tiles-body-alt {
        background: #e36d4f;
    }

    .info-tiles.tiles-alizarin .tiles-footer {
        background: #e05e3d;
    }

    .info-tiles.tiles-alizarin:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-alizarin:hover .tiles-heading {
        background: #e47458;
    }

    .info-tiles.tiles-alizarin:hover .tiles-body {
        background: #e05b39;
    }

    .info-tiles.tiles-alizarin:hover .tiles-body-alt {
        background: #e05b39;
    }

    .info-tiles.tiles-alizarin:hover .tiles-footer {
        background: #dd4c27;
    }

    .info-tiles.tiles-facebook {
        color: #ffffff !important;
    }

    .info-tiles.tiles-facebook .tiles-heading {
        background: #466ab5;
    }

    .info-tiles.tiles-facebook .tiles-body {
        background: #3b5998;
    }

    .info-tiles.tiles-facebook .tiles-body-alt {
        background: #3b5998;
    }

    .info-tiles.tiles-facebook .tiles-footer {
        background: #355089;
    }

    .info-tiles.tiles-facebook:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-facebook:hover .tiles-heading {
        background: #3e5d9f;
    }

    .info-tiles.tiles-facebook:hover .tiles-body {
        background: #344e86;
    }

    .info-tiles.tiles-facebook:hover .tiles-body-alt {
        background: #344e86;
    }

    .info-tiles.tiles-facebook:hover .tiles-footer {
        background: #2e4677;
    }

    .info-tiles.tiles-twitter {
        color: #ffffff !important;
    }

    .info-tiles.tiles-twitter .tiles-heading {
        background: #17bfff;
    }

    .info-tiles.tiles-twitter .tiles-body {
        background: #00aced;
    }

    .info-tiles.tiles-twitter .tiles-body-alt {
        background: #00aced;
    }

    .info-tiles.tiles-twitter .tiles-footer {
        background: #009dd9;
    }

    .info-tiles.tiles-twitter:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-twitter:hover .tiles-heading {
        background: #00b3f7;
    }

    .info-tiles.tiles-twitter:hover .tiles-body {
        background: #0099d4;
    }

    .info-tiles.tiles-twitter:hover .tiles-body-alt {
        background: #0099d4;
    }

    .info-tiles.tiles-twitter:hover .tiles-footer {
        background: #008bbf;
    }

    .info-tiles.tiles-dribbble {
        color: #ffffff !important;
    }

    .info-tiles.tiles-dribbble .tiles-heading {
        background: #ee71a1;
    }

    .info-tiles.tiles-dribbble .tiles-body {
        background: #ea4c89;
    }

    .info-tiles.tiles-dribbble .tiles-body-alt {
        background: #ea4c89;
    }

    .info-tiles.tiles-dribbble .tiles-footer {
        background: #e83a7d;
    }

    .info-tiles.tiles-dribbble:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-dribbble:hover .tiles-heading {
        background: #eb558f;
    }

    .info-tiles.tiles-dribbble:hover .tiles-body {
        background: #e7357a;
    }

    .info-tiles.tiles-dribbble:hover .tiles-body-alt {
        background: #e7357a;
    }

    .info-tiles.tiles-dribbble:hover .tiles-footer {
        background: #e5236e;
    }

    .info-tiles.tiles-vimeo {
        color: #ffffff !important;
    }

    .info-tiles.tiles-vimeo .tiles-heading {
        background: #badc71;
    }

    .info-tiles.tiles-vimeo .tiles-body {
        background: #aad450;
    }

    .info-tiles.tiles-vimeo .tiles-body-alt {
        background: #aad450;
    }

    .info-tiles.tiles-vimeo .tiles-footer {
        background: #a2d040;
    }

    .info-tiles.tiles-vimeo:hover {
        color: #ffffff;
    }

    .info-tiles.tiles-vimeo:hover .tiles-heading {
        background: #aed658;
    }

    .info-tiles.tiles-vimeo:hover .tiles-body {
        background: #a0cf3c;
    }

    .info-tiles.tiles-vimeo:hover .tiles-body-alt {
        background: #a0cf3c;
    }

    .info-tiles.tiles-vimeo:hover .tiles-footer {
        background: #96c631;
    }
</style>