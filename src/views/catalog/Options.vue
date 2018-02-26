<template>
    <section>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="Search"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getOptions">Search</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="handleAdd">Add</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="options" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="Name" width="180" sortable>
            </el-table-column>
            <el-table-column prop="description" label="Desciription" width="250" sortable>
            </el-table-column>
            <el-table-column prop="status" label="Status" width="200" sortable>
            </el-table-column>
            <el-table-column prop="required" label="Required" width="200" sortable>
            </el-table-column>
            <el-table-column label="Actions" width="300">
                <template scope="scope">
                    <el-button size="small" type="warning" @click="handleEdit(scope.$index, scope.row)">Activate</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">Delete Marked</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <el-dialog title="Edit Option" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="bannerFormRules" ref="bannerForm">
                <el-form-item label="Name" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Description">
                    <el-input type="textarea" v-model="editForm.description"></el-input>
                </el-form-item>
                <el-form-item label="Status">
                    <el-radio-group v-model="editForm.status" >
                        <el-radio class="radio"  :label="1">Active</el-radio>
                        <el-radio class="radio"  :label="0">Inactive</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Required">
                    <el-radio-group v-model="editForm.required" >
                        <el-radio class="radio"  :label="1">Active</el-radio>
                        <el-radio class="radio"  :label="0">Inactive</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">Save</el-button>
            </div>
        </el-dialog>


        <el-dialog title="Add Option" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="Name" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Description">
                    <el-input type="textarea" v-model="addForm.description"></el-input>
                </el-form-item>
                <el-form-item label="Status">
                    <el-radio-group v-model="addForm.status" >
                        <el-radio class="radio"  :label="1">Active</el-radio>
                        <el-radio class="radio"  :label="0">Inactive</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="Required">
                    <el-radio-group v-model="addForm.required" >
                        <el-radio class="radio"  :label="1">Active</el-radio>
                        <el-radio class="radio"  :label="0">Inactive</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">Save</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {removeUser, batchRemoveUser, getOptions,addOption,editOption} from '../../api/api';

    export default {
        name: 'Option',
        data() {
            return {
                imageUrl: '',
                radio: '1',
                filters: {
                    name: ''
                },
                options: [],
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
                    description: '',
                    status: '0',
                    required: false
                },

                addFormVisible: false,
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: 'Required', trigger: 'blur' }
                    ]
                },
                //
                addForm: {
                    name: '',
                    description: '',
                    status:'0',
                    required: false
                }

            }
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('Avatar picture must be JPG format!');
                }
                if (!isLt2M) {
                    this.$message.error('Avatar picture size can not exceed 2MB!');
                }
                return isJPG && isLt2M;
            },
            //
            formatSex: function (row, column) {
                return row.sex == 1 ? 'Male' : row.sex == 0 ? 'Female' : 'ddd';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getOption();
            },
            //
            handleDel: function (index, row) {
                this.$confirm('Delete USer?', 'Delete', {
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
                        this.getOption();
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
            //
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    description: '',
                    status:'0',
                    required: false
                };
            },
            editSubmit: function () {
                this.$refs.bannerForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Update？', 'Edit', {}).then(() => {
                            this.submitLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.bannerForm);
                            editOption(para).then((res) => {
                                this.submitLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Updated',
                                    type: 'success'
                                });
                                this.$refs['bannerForm'].resetFields();
                                this.isEditing = false;
                                this.getOptions();
                            });
                        });
                    }
                });
            },
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Save Option？', 'Save', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            addOption(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Saved.',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getOptions();
                            });
                        });
                    }
                });
            },
            getOptions: function () {
                let para = {
                    page: this.page,
                    name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getOptions(para).then((res) => {
                    //this.total = res.data.total;
                    this.options = res.data.data;
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
                        this.getOptions();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getOptions();
        }
    }

</script>

<style scoped>

</style>