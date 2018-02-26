<template>
    <section>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="Search"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getProducts">Search</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">Add</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="Name" width="180" sortable>
            </el-table-column>
            <el-table-column prop="manufacturer.name" label="Manufacturer" width="400" sortable>
            </el-table-column>
            <el-table-column label="Actions" width="300">
                <template scope="scope">
                    <el-button size="small" type="warning" @click="handleEdit(scope.$index, scope.row)">Stock
                    </el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">Delete Marked</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {
        getUserListPage,
        removeUser,
        batchRemoveUser,
        editUser,
        addUser,
        getCategories,
        getProducts
    } from '../../api/api';

    export default {
        name: 'products',
        data() {
            return {
                filters: {
                    name: ''
                },
                products: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],
            }
        },
        methods: {
            formatSex: function (row, column) {
                return row.sex == 1 ? 'Male' : row.sex == 0 ? 'Female' : 'ddd';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getProducts();
            },
            //
            getProducts() {
                let para = {
                    page: this.page,
                    name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getProducts(para).then((res) => {
                    //this.total = res.data.total;
                    this.products = res.data.data;
                    this.total=res.data.data.length;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //
            handleDel: function (index, row) {
                this.$confirm('Delete Product?', 'Delete', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: 'Deleted',
                            type: 'success'
                        });
                        this.getProducts();
                    });
                }).catch(() => {

                });
            },
            //
            handleEdit: function (index, row) {
                this.$router.push({path: `/products/edit/${row.id}`});
            },
            //
            handleAdd: function () {
                this.$router.push({path: '/products/add'});
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
                    let para = {ids: ids};
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: 'Deleted',
                            type: 'success'
                        });
                        this.getProducts();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getProducts();
        }
    }

</script>

<style scoped>

</style>