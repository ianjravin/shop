<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="card-details">
                    <h3>Order Details</h3>
                    <h4>Order Number: {{ order.order_number }} </h4>
                    <h4>Invoice Number: {{ order.invoice_number }} </h4>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="card-details">
                    <h3>Customer Details</h3>
                    <h4>Name: {{ order.customer.name }}</h4>
                    <h4>Phone Number: {{ order.phone_number }}</h4>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="card-details">
                    <h3>Payment Details</h3>
                    <h4>Payment Method: {{ order.payment_type_id }}</h4>
                    <h4>Payment Reference: {{ order.payment_reference }}</h4>
                </el-card>
            </el-col>
        </el-row>
        <el-row >
            <el-col :span="24">
                <el-card>
                    <h3>Order lines</h3>
                        <el-table :data="orderProducts" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column type="index" width="60">
                            </el-table-column>
                            <el-table-column prop="name" label="Name" width="180" sortable>
                            </el-table-column>
                            <el-table-column prop="quantity" label="Quantity" width="250" sortable>
                            </el-table-column>
                            <el-table-column prop="amount" label="Amount" width="200" sortable>
                            </el-table-column>
                            <el-table-column label="Actions" width="300">
                                <template scope="scope">
                                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="Edit Order Product" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="bannerFormRules" ref="bannerForm">
                <el-form-item label="Name" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Quantity">
                    <el-input-number type="textarea" v-model="editForm.quantity"></el-input-number>
                </el-form-item>
                <el-form-item label="Amount">
                    <el-input type="textarea" v-model="editForm.amount"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">Save</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {removeUser, batchRemoveUser, getOrdersProducts, editOrderProducts, getOrder} from '../../api/api';

    export default {
        name: 'order-products',
        data() {
            return {
                name: '',
                quantity: '1',
                ammout:'',
                filters: {
                    name: ''
                },
                orderProducts: [],
                order: {
                    checkout_type_id: 0,
                    coupon_id: 0,
                    created_at: "",
                    customer_id: 0,
                    deleted_at: null,
                    discount: "",
                    id: 0,
                    invoice_number: "",
                    order_number: "",
                    order_status_id: 0,
                    payment_reference: "",
                    payment_type_id: 0,
                    total: "",
                    updated_at: "",
                    order_products: []
                },
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],

                isEditing: false,
                submitLoading: false,
                bannerFormRules: {
                    name: [
                        { required: true, message: 'Required', trigger: 'blur' }
                    ]
                },
                //
                bannerForm: {
                    id: 0,
                    name: '',
                    quantity: '1',
                    amout:'',
                },

                addFormVisible: false,
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: 'Required', trigger: 'blur' }
                    ]
                },

            }
        },
        methods: {
            //
            formatSex: function (row, column) {
                return row.sex == 1 ? 'Male' : row.sex == 0 ? 'Female' : 'ddd';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getOrder();
            },
            //
            handleDel: function (index, row) {
                this.$confirm('Delete Manufacturer?', 'Delete', {
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
            });
            }).catch(() => {

                });
            },
            //
            handleEdit: function (index, row) {
                this.isEditing = true;
                console.log(row);
                this.bannerForm = Object.assign({}, row);
            },
            editSubmit: function () {
                this.$refs.bannerForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Update？', 'Edit', {}).then(() => {
                            this.submitLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.bannerForm);
                        editOrderProducts(para).then((res) => {
                            this.submitLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: 'Updated',
                            type: 'success'
                        });
                        this.$refs['bannerForm'].resetFields();
                        this.isEditing = false;
                    });
                    });
                    }
                });
            },
            getOrder : function (id) {
                let para = {
                    id: id
                };
                getOrder(para).then((res) => {
                    //this.total = res.data.total;
                    this.order = res.data.data;
                    this.orderProducts= this.order.order_products;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            getOrdersProducts: function (id) {
                let para = {
                    page: this.page,
                    name: this.filters.name,
                    id: id
                };
                this.listLoading = true;
                //NProgress.start();
                getOrdersProducts(para).then((res) => {
                    //this.total = res.data.total;
                    this.orderProducts = res.data.data;
                this.listLoading = false;
                //NProgress.done();
            });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
        },
        mounted() {
            if (this.$route.params.id) {
                this.getOrder(this.$route.params.id);
            }
        }
    }

</script>

<style scoped>
    .card-details{
        margin-bottom:20px;
    }
</style>