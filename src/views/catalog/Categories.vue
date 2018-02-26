<template>
    <section>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="Search"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getCategories">Search</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">Add</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="categories" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="Name" width="150" sortable>
            </el-table-column>
            <el-table-column prop="description" label="Description" width="150" sortable>
            </el-table-column>
            <el-table-column prop="sort" label="Sort Order" width="150" :formatter="formartSort" sortable>
            </el-table-column>
            <el-table-column prop="parent_category.name" label="Parent Category" width="180" sortable>
            </el-table-column>
            <el-table-column label="Actions" width="300">
                <template scope="scope">
                    <el-button v-if="false" size="small" type="warning" @click="handleEdit(scope.$index, scope.row)">Activate
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

        <el-dialog title="Edit Category" label-position="left" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                <el-form-item label="Name" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Parent" prop="parent_category_id" >
                    <el-select v-model="editForm.parent_category_id" value="0"  clearable>
                        <el-option value="0">None</el-option>
                        <el-option
                                v-for="option in categories"
                                :key="option.id"
                                :label="option.name"
                                :value="option.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Top category">
                   <el-checkbox v-model="editForm.top_category"/>
                </el-form-item>
                <el-form-item label="Published">
                    <el-radio-group v-model="editForm.status">
                        <el-radio class="radio" :label="1">Enabled</el-radio>
                        <el-radio class="radio" :label="0">Disabled</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Sort Order" v-if="editForm.parent_category_id==0">
                    <el-input-number v-model="editForm.sort" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="Description">
                    <el-input type="textarea" v-model="editForm.description"></el-input>
                </el-form-item>
                <el-form-item label="Image">
                    <el-upload
                            action=""
                            :show-file-list="false"
                            list-type="picture-card"
                            :before-upload="uploadCategoryImage">
                        <img v-if="editForm.image_url" :src="getImageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">Save</el-button>
            </div>
        </el-dialog>


        <el-dialog title="Add Category" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
                <el-form-item label="Name" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Parent" prop="parent_category_id">
                    <el-select v-model="addForm.parent_category_id" value="-1" clearable>
                        <el-option :value="0" label="None"></el-option>
                        <el-option
                                v-for="option in categories"
                                :key="option.id"
                                :label="option.name"
                                :value="option.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Top category">
                    <el-checkbox v-model="addForm.top_category"/>
                </el-form-item>
                <el-form-item label="Visible" prop="status">
                    <el-radio-group v-model="addForm.status">
                        <el-radio class="radio" :label="1">Enabled</el-radio>
                        <el-radio class="radio" :label="0">Disabled</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Sort Order" prop="sort" v-if="addForm.parent_category_id==0">
                    <el-input-number v-model="addForm.sort" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="Description" prop="description">
                    <el-input type="textarea" v-model="addForm.description"></el-input>
                </el-form-item>
                <el-form-item label="Image">
                    <el-upload
                            action=""
                            :show-file-list="false"
                            list-type="picture-card"
                            :before-upload="uploadCategoryImage"
                            :on-success="onCategoryImageUpload">
                        <img v-if="addForm.image_url" :src="getImageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
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
    import {
        getUserListPage,
        removeUser,
        batchRemoveUser,
        editUser,
        addUser,
        getCategories,
        addCategory, editCategory, uploadFile
    } from '../../api/api';
    import {apiBaseUrl, productImagesUrl} from "../../config/index";
    import ElOption from "../../../node_modules/element-ui/packages/select/src/option";

    export default {
        components: {ElOption},
        name: 'categories',
        data() {
            return {
                filters: {
                    name: ''
                },
                categories: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],

                editFormVisible: false,
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: 'Required', trigger: 'blur'}
                    ]
                },
                //
                editForm: {
                    id: 0,
                    parent_category_id: 0,
                    name: '',
                    description: '',
                    sort: 0,
                    image: '',
                    thumbnail: '',
                    status: 0,
                    top_category: 0
                },

                addFormVisible: false,
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: 'Required', trigger: 'blur'}
                    ]
                },
                //
                addForm: {
                    parent_category_id: 0,
                    name: '',
                    description: '',
                    sort: 0,
                    image: '',
                    thumbnail: '',
                    status: 0,
                    top_category: 0
                }

            }
        },
        methods: {
            //
            formartSort: function (row, column) {
                if(row.parent_category_id !=0){
                    return ''
                }
                return row.sort==0? '': row.sort
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getCategories();
            },
            //
            getCategories() {
                let para = {
                    page: this.page,
                    name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getCategories(para).then((res) => {
                    this.categories = res.data.data;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //
            handleDel: function (index, row) {
                this.$confirm('Delete Category?', 'Delete', {
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
                        this.getCategories();
                    });
                }).catch(() => {

                });
            },
            //
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = {
                    id: row.id,
                    parent_category_id: row.parent_category_id,
                    name: row.name,
                    description: row.description,
                    sort: row.sort,
                    image: row.image_url,
                    thumbnail: row.thumbnail,
                    status: row.status,
                    top_category: row.top_category === 0 ? false: true
                }
                // Object.assign({}, row);
            },
            //
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    parent_category_id: 0,
                    name: '',
                    description: '',
                    sort: 0,
                    image: '',
                    thumbnail: '',
                    status: 0,
                    top_category: 0
                }
            },
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Update？', 'Edit', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            editCategory(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Updated',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getCategories();
                            });
                        });
                    }
                });
            },
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Save Category？', 'Save', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            //console.log(para);
                            addCategory(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Saved.',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getCategories();
                            });
                        });
                    }
                });
            },
            getImageUrl () {
                if(!this.editFormVisible) {
                    if(this.addForm.image_url ==='' || this.addForm.image_url ==='undefined'){
                        return null;
                    }
                    return productImagesUrl + this.addForm.image_url;
                }else{
                    if(this.editForm.image_url ==='' || this.editForm.image_url ==='undefined'){
                        return null;
                    }
                  return productImagesUrl+ this.editForm.image_url;
                }
            },
            uploadCategoryImage(file) {
                var data = new FormData();
                data.append('image', file);

                uploadFile({data: data, url: this.getProductCategoryUploadUrl(), method: 'post'}).then((res) => {
                    if(!this.editFormVisible) {
                        this.addForm.image_url= res.data.data;
                    }else{
                        this.editForm.image_url= res.data.data;
                    }
                });
                return false;
            },
            getProductCategoryUploadUrl() {
                if(!this.editFormVisible) {
                    return apiBaseUrl + '/categories/0/image/upload';
                }else{
                    return apiBaseUrl + '/categories/'+ this.editForm.id +'/image/upload';
                }
            },
            onCategoryImageUpload () {
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
                        this.getCategories();
                    });
                }).catch(() => {

                });
            }
        },
        computed: {

        },
        mounted() {
            this.getCategories();
        }
    }

</script>

<style scoped>

</style>