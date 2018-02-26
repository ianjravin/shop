<template>
    <section>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="Search"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getBanners">Search</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">Add</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="banners" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="description" label="Description" width="200" sortable>
            </el-table-column>
            <el-table-column prop="created_at" label="Created at" width="200" sortable>
            </el-table-column>
            <el-table-column prop="valid_to" label="Valid to" width="200" sortable>
            </el-table-column>
            <el-table-column prop="status" label="Status" width="180" :formatter="formatStatus" sortable>
            </el-table-column>
            <el-table-column prop="image_url" label="Status" width="180" :formatter="formatImage" sortable>
            </el-table-column>
            <el-table-column label="Actions" width="300">
                <template scope="scope">
                    <el-button size="small" type="info" @click="handleUpload(scope.$index, scope.row)">Upload Image
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
        <el-dialog title="Upload Image" v-model="uploadFormShowing">
            <el-form label-position="top">
                <el-form-item label="Image">
                    <el-upload
                            action=""
                            :show-file-list="false"
                            list-type="picture-card"
                            :before-upload="uploadBannerImage">
                        <img v-if="bannerForm.image_url" :src="getImageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="bannerForm.id == 0? 'Add Banner':'Edit Banner'"  v-model="formShowing" :close-on-click-modal="false">
            <el-form :model="bannerForm" label-position="left" label-width="150px" :rules="bannerFormRules" ref="bannerForm">
                <el-form-item label="Product" prop="parent_Banner_id" >
                    <el-select v-model="bannerForm.product_id" value="0"  clearable filterable>
                        <el-option value="0" label="None" >None</el-option>
                        <el-option
                                v-for="option in products"
                                :key="option.id"
                                :label="option.name"
                                :value="option.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Valid to">
                    <el-date-picker
                            v-model="bannerForm.valid_to"
                            type="datetime"
                            placeholder="Select date and time">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Status">
                    <el-radio-group v-model="bannerForm.status">
                        <el-radio class="radio" :label="1">Published</el-radio>
                        <el-radio class="radio" :label="0">Unpublished</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Description">
                    <el-input type="textarea" v-model="bannerForm.description"></el-input>
                </el-form-item>
                <!--    <el-form-item label="Image">
                        <el-upload
                                action=""
                                :show-file-list="false"
                                list-type="picture-card"
                                :before-upload="uploadBannerImage">
                            <img v-if="bannerForm.image_url" :src="getImageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formShowing = false">Cancel</el-button>
                <el-button type="primary" @click.native="formSubmit" :loading="submitLoading">Save</el-button>
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
        getBanners,
        addBanner, editBanner, uploadFile, getProducts, deleteBanner
    } from '../../api/api';
    import {apiBaseUrl, productImagesUrl} from "../../config/index";
    import ElOption from "../../../node_modules/element-ui/packages/select/src/option";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
    import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component";
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form";

    export default {
        components: {
            ElForm,
            ElDialog,
            ElFormItem,
            ElOption},
        name: 'banners',
        data() {
            return {
                filters: {
                    name: ''
                },
                banners: [],
                products: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],
                formShowing: false,
                uploadFormShowing: false,
                isEditing: false,
                submitLoading: false,
                bannerFormRules: {
                    name: [
                        {required: true, message: 'Required', trigger: 'blur'}
                    ]
                },
                //
                bannerForm: {
                    id: 0,
                    description: '',
                    product_id: 0,
                    valid_to: '',
                    status: 0
                }
            }
        },
        methods: {
            //
            handleUpload : function (index, row) {
                this.bannerForm = row
                this.uploadFormShowing = true
            },
            formSubmit: function () {
                if(this.bannerForm.id ==0){
                    this.addSubmit();
                }else{
                    this.editSubmit();
                }
            },
            formatStatus: function (row, column) {
                if(row.status === 0){
                    return 'Unpublished'
                }
                return 'Published'
            },
            formatImage : function (row, column) {
                if(row.image_url === ''){
                    return 'No Image'
                }
                return 'Image Uploaded'
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getBanners();
            },
            //
            getBanners() {
                let para = {
                    page: this.page,
                    name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getBanners(para).then((res) => {
                    this.banners = res.data.data;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //
            handleDel: function (index, row) {
                this.$confirm('Delete Banner?', 'Delete', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    deleteBanner(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: 'Deleted',
                            type: 'success'
                        });
                        this.getBanners();
                    });
                }).catch(() => {

                });
            },
            //
            handleEdit: function (index, row) {
                this.isEditing = true;
                this.formShowing = true;
                this.bannerForm = {
                    product_id: row.product_id,
                    valid_to: row.valid_to,
                    id: row.id,
                    description: row.description,
                    image: row.image_url,
                    status: row.status,
                }
                // Object.assign({}, row);
            },
            handleAdd: function () {
                this.formShowing = true
                this.bannerForm = {
                    product_id: 0,
                    valid_to: new Date(),
                    id: 0,
                    description: '',
                    image: '',
                    status: '',
                }
            },
            editSubmit: function () {
                this.$refs.bannerForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Update？', 'Edit', {}).then(() => {
                            this.submitLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.bannerForm);
                            editBanner(para).then((res) => {
                                this.submitLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Updated',
                                    type: 'success'
                                });
                                this.$refs['bannerForm'].resetFields();
                                this.isEditing = false;
                                this.formShowing = false
                                this.getBanners();
                            });
                        });
                    }
                });
            },
            addSubmit: function () {
                this.$refs.bannerForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Save Banner？', 'Save', {}).then(() => {
                            this.submitLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.bannerForm);
                            //console.log(para);
                            addBanner(para).then((res) => {
                                this.submitLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Saved.',
                                    type: 'success'
                                });
                                this.$refs['bannerForm'].resetFields();
                                this.formShowing = false;
                                this.getBanners();
                            });
                        });
                    }
                });
            },
            getImageUrl() {
                if(!this.isEditing) {
                    if(this.addForm.image_url ==='' || this.addForm.image_url ==='undefined'){
                        return null;
                    }
                    return productImagesUrl + this.addForm.image_url;
                }else{
                    if(this.bannerForm.image_url ==='' || this.bannerForm.image_url ==='undefined'){
                        return null;
                    }
                  return productImagesUrl+ this.bannerForm.image_url;
                }
            },
            uploadBannerImage(file) {
                var data = new FormData();
                data.append('image', file);
                this.uploadFormShowing = false

                uploadFile({data: data, url: this.getProductBannerUploadUrl(), method: 'post'}).then((res) => {
                    this.$message({
                        message: 'Image uploaded.',
                        type: 'success'
                    });
                    this.getBanners();
                });
                return false;
            },
            getProductBannerUploadUrl() {
                return apiBaseUrl + '/banners/'+ this.bannerForm.id +'/image/upload';
            },
            onBannerImageUpload () {
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
                        this.getBanners();
                    });
                }).catch(() => {

                });
            },
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
                    this.total = res.data.data.length;
                    this.listLoading = false;
                    //NProgress.done();
                });
            }
        },
        computed: {

        },
        mounted() {
            this.getBanners();
            this.getProducts();
        }
    }

</script>

<style scoped>

</style>