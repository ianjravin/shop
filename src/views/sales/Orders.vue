<template>
    <section>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.query" placeholder="Search"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.status" placeholder="Status">
                        <el-option value="-1" label="All">All</el-option>
                        <el-option value="0" label="Received">Received</el-option>
                        <el-option value="4" label="Reversed">Reversed</el-option>
                        <el-option value="1" label="Paid">Paid</el-option>
                        <el-option value="2" label="Completed">Completed</el-option>
                        <el-option value="3" label="Shipped">Shipped</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getOrders">Search</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="orders" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="order_number" label="Order Number" width="180" sortable>
            </el-table-column>
            <el-table-column prop="invoice_number" label="Invoice Number" width="180" sortable>
            </el-table-column>
            <el-table-column prop="payment_type.name" label="Payment" width="120" sortable>
            </el-table-column>
            <el-table-column prop="payment_reference" label="Payment Ref." width="180" sortable>
            </el-table-column>
            <el-table-column prop="checkout_type.name" label="Checkout Type" width="180" sortable>
            </el-table-column>
            <el-table-column prop="total" label=" Total" width="100" sortable>
            </el-table-column>
            <el-table-column prop="created_at" label="Order Time" width="180" sortable>
            </el-table-column>
            <el-table-column label="Actions" width="220">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">View</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">Delete Marked</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

       </section>
</template>

<script>
    import util from '../../common/js/util'
    import {removeUser, batchRemoveUser, getOrders} from '../../api/api';

    export default {
        components: {},
        name: 'orders',
        data() {
            return {
                filters: {
                    query: '',
                    status: -1,
                    page: 0
                },
                orders: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],

                }
        },
        methods: {
           //
            formatSex: function (row, column) {
                return row.sex == 1 ? 'Male' : row.sex == 0 ? 'Female' : 'ddd';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getManufacturers();
            },
            //
            handleDel: function (index, row) {
                this.$confirm('Delete Order?', 'Delete', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                //NProgress.start();
                let para = { id: row.id };
                removeUser(para).then((res) => {
                    this.listLoading = false;
                //NProgress.done();
                this.$message({
                    message: 'Deleted',
                    type: 'success'
                });
                this.getOrders();
            });
            }).catch(() => {

                });
            },
        getOrders: function () {
                let para = {
                    page: this.page,
                    name: this.filters.name,
                    status: this.filters.status
                };
                this.listLoading = true;
                //NProgress.start();
            getOrders(para).then((res) => {
                    //this.total = res.data.total;
                    this.orders = res.data.data;
                    this.listLoading = false;
                //NProgress.done();
            });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('Delete  selected？', 'Delete', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                //NProgress.start();
                let para = { ids: ids };
                batchRemoveUser(para).then((res) => {
                    this.listLoading = false;
                //NProgress.done();
                this.$message({
                    message: 'Deleted',
                    type: 'success'
                });

            });
            }).catch(() => {

                });

        }
        },
        mounted() {
            this.getOrders();
        }
    }

</script>

<style scoped>

</style>