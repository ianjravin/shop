<template>
    <section>
        <el-row>
            <el-col :span="24">
                <el-card>
                    <el-tabs type="card" @tab-click="handleClick">
                        <el-tab-pane label="Product Information">
                            <el-form labelPosition="left" ref="productInformation" :rules="productFormRules"
                                     :model="productForm" label-width="120px">
                                <el-form-item label="Name" prop="name">
                                    <el-input v-model="productForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="Price (Kshs.)" prop="price">
                                    <el-input-number v-model="productForm.price"
                                                     placeholder="Price"></el-input-number>
                                </el-form-item>
                                <el-form-item label="Manufacturer" prop="manufacturer_id">
                                    <el-select v-model="productForm.manufacturer_id" clearable
                                               placeholder="Manufacturer">
                                        <el-option
                                                v-for="option in manufacturers"
                                                :key="option.id"
                                                :label="option.name"
                                                :value="option.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="Published" prop="status">
                                    <el-switch on-text="" off-text="" v-model="productForm.status"></el-switch>
                                    <!--               <el-radio-group v-model="productForm.status">
                                                       <el-radio :label="1">Active</el-radio>
                                                       <el-radio :label="0">Inactive</el-radio>
                                                   </el-radio-group>-->
                                </el-form-item>
                                <el-form-item label="Description" prop="description">
                                    <vue-editor v-model="productForm.description"></vue-editor>
                                </el-form-item>
                                <el-form-item label="Categories">
                                    <el-select v-model="productForm.categories" multiple placeholder="Select Categories"
                                               style="width: 100%">
                                        <el-option
                                                v-for="item in categories"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="saveProductInformation"
                                               :loading="savingProductInformation">Save
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="Product Options">
                            <el-row :gutter="20">
                                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                                    <el-form ref="productOption" :rules="productOptionFormRules"
                                             :model="productOptionForm" label-width="120px"
                                             labelPosition="left">
                                        <el-form-item label="Option">
                                            <el-select v-model="productOptionForm.option_id"
                                                       placeholder="select an option">
                                                <el-option
                                                        v-for="item in options"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Name/Value" prop="name">
                                            <el-input v-model="productOptionForm.name"
                                                      placeholder="S, M, L, XL"></el-input>
                                        </el-form-item>
                                        <el-form-item label="Amount +/-" prop="price">
                                            <el-input-number v-model="productOptionForm.price"
                                                             placeholder="Price"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="Published">
                                            <el-switch on-text="" off-text=""
                                                       v-model="productOptionForm.status"></el-switch>
                                        </el-form-item>
                                        <el-form-item label="Description" prop="description">
                                            <el-input type="textarea"
                                                      v-model="productOptionForm.description"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button-group>
                                                <el-button type="default" v-if="productOptionForm.id!=-1"
                                                           @click="clearOptionForm">New
                                                </el-button>
                                                <el-button type="primary" :loading="savingProductOption"
                                                           @click="saveProductOption">Save
                                                </el-button>
                                            </el-button-group>

                                        </el-form-item>
                                        <span class="help-block">
                                            <i class="fa fa-info-circle"></i>
                                            Product options provided for the same option will be grouped together<br/>
                                            <i class="fa fa-info-circle"></i>
                                             Amount is the value to add or remove when a customer selects the option
                                        </span>
                                    </el-form>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                                    <el-table height="250"
                                              :data="productOptions"
                                              border
                                              highlight-current-row
                                              style="width: 100%">
                                        <el-table-column prop="option_id" label="Option" width="100">

                                        </el-table-column>
                                        <el-table-column prop="name" label="Name" width="100">

                                        </el-table-column>
                                        <el-table-column prop="description" label="Description" width="200">
                                        </el-table-column>
                                        <el-table-column prop="price" label="Price" width="100">

                                        </el-table-column>
                                        <el-table-column label="Actions" width="150">
                                            <template scope="scope">
                                                <el-button size="small"
                                                           @click="handleOptionEdit(scope.$index, scope.row)">Edit
                                                </el-button>
                                                <el-button type="danger" size="small"
                                                           @click="handleOptionDelete(scope.$index, scope.row)">Delete
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="Images">
                            <el-row :gutter="20">
                                <el-col :sm="24" :xs="24" :md="24" :lg="12">
                                    <h3>Image</h3>
                                    <el-upload
                                            class="avatar-uploader"
                                            v-bind:action="uploadUrl"
                                            :show-file-list="false"
                                            :on-success="onProductImageUpload"
                                            :before-upload="uploadProductImage">
                                        <img v-if="productForm.image_url!=''" :src="productImageUrl"
                                             class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-col>
                                <el-col :sm="24" :xs="24" :md="24" :lg="12">
                                    <h3>Other Images</h3>
                                    <el-upload
                                            :action="uploadUrl"
                                            list-type="picture-card"
                                            :fileList="productImages"
                                            :before-upload="uploadProductImages"
                                            :on-success="onProductImagesUpload"
                                            :on-preview="handlePictureCardPreview"
                                            :on-remove="handleRemoveProductImage">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog v-model="productImageDialogVisible" size="tiny">
                                        <img width="100%" :src="getImageUrl" alt="">
                                    </el-dialog>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="Attributes">
                            <el-row :gutter="20">
                                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                                    <el-form ref="attributeForm" :rules="productAttributeFormRules"
                                             :model="productAttributeForm" label-width="120px"
                                             labelPosition="left">
                                        <el-form-item label="Attribute" prop="attribute_id">
                                            <el-select v-model="productAttributeForm.attribute_id"
                                                       placeholder="Select Attribute">
                                                <el-option
                                                        v-for="item in attributes"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Description" prop="value">
                                            <el-input type="textarea" v-model="productAttributeForm.value"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button-group>
                                                <el-button type="default" v-if="productAttributeForm.id!=-1"
                                                           @click="clearAttributeForm">New
                                                </el-button>
                                                <el-button type="primary" :loading="savingProductAttribute"
                                                           @click="saveProductAttribute">Save
                                                </el-button>
                                            </el-button-group>
                                        </el-form-item>
                                        <span class="help-block">
                                            <i class="fa fa-info-circle"></i>
                                             Attributes will be shown in their specific groups.
                                        </span>
                                    </el-form>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                                    <el-table height="250"
                                              :data="productAttributes"
                                              border
                                              style="width: 100%">
                                        <el-table-column prop="attribute.name" label="Attribute" width="180">

                                        </el-table-column>
                                        <el-table-column prop="value" label="Description" width="200">
                                        </el-table-column>
                                        <el-table-column label="Actions" width="300">
                                            <template scope="scope">
                                                <el-button size="small"
                                                           @click="handleAttributeEdit(scope.$index, scope.row)">
                                                    Edit
                                                </el-button>
                                                <el-button type="danger" size="small"
                                                           @click="handleAttributeDelete(scope.$index, scope.row)">
                                                    Delete
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="Discounts">
                            <el-row :gutter="20">
                                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                                    <el-form ref="form" :model="productOptionDiscountForm" label-width="120px"
                                             labelPosition="left">
                                        <el-form-item label="Option">
                                            <el-select v-model="productOptionDiscountForm.product_option_id"
                                                       placeholder="Product Option">
                                                <el-option
                                                        v-for="option in productOptions"
                                                        :key="option.id"
                                                        :label="option.name"
                                                        :value="option.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="value">
                                            <el-input-number v-model="productOptionDiscountForm.price"
                                                             placeholder="Amount"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="Validity">
                                            <el-date-picker type="daterange" placeholder="Pick a date"
                                                            v-model="productOptionDiscountForm.validity"
                                                            size="large"
                                                            range-separator="     To     "
                                                            style="width: 50%;"></el-date-picker>
                                        </el-form-item>
                                        <el-form-item label="Active">
                                            <el-switch on-text="" off-text=""
                                                       v-model="productOptionDiscountForm.status"></el-switch>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="onSubmit">Add</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                                    <el-table height="250"
                                              :data="productOptions"
                                              border
                                              style="width: 100%">
                                        <el-table-column prop="option.name" label="Option" width="180">

                                        </el-table-column>
                                        <el-table-column prop="name" label="Name" width="180">

                                        </el-table-column>
                                        <el-table-column prop="description" label="Description" width="200">
                                        </el-table-column>
                                        <el-table-column prop="price" label="Price" width="180">

                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">Create</el-button>
                        <el-button>Cancel</el-button>
                    </el-form-item>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
    import {VueEditor} from 'vue2-editor'
    import {
        addProduct, addProductAttribute, addProductOption, deleteProductOption,
        editProduct, editProductAttribute, editProductOption,
        getAttributes,
        getCategories,
        getManufacturers, getOptions,
        getProduct, getProductAttributes, getProductOptions,
        uploadFile
    } from "../../api/api";
    import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
    import config from '../../config'
    import {apiBaseUrl, productImagesUrl} from "../../config/index";
    import {getFileUrl} from '../../common/js/util'
    import ElButtonGroup from "../../../node_modules/element-ui/packages/button/src/button-group";
    export default{
        components: {
            ElButtonGroup,
            ElButton,
            ElFormItem,
            ElCol,
            ElRow,
            VueEditor
        },
        data() {
            return {
                savingProductInformation: false,
                updatingProductInformation: false,
                savingProductOption: false,
                savingProductAttribute: false,
                productImageDialogVisible: false,
                dialogImageUrl: '',
                formProductProcessing: false,
                formProductAttributeProcessing: false,
                formProductOptionProcessing: false,
                formProductOptionDiscountProcessing: false,
                manufacturers: [],
                categories: [],
                attributes: [],
                options: [],
                productImageUrl: '',
                productForm: {
                    id: -1,
                    name: '',
                    manufacturer_id: -1,
                    status: 0,
                    thumbnail_url: '',
                    image_url: '',
                    description: '',
                    categories: [],
                    price: 0.00
                },
                productOptionForm: {
                    id: -1,
                    name: '',
                    option_id: '',
                    description: '',
                    price: 0.00,
                    status: 0
                },
                productOptionDiscountForm: {
                    id: -1,
                    name: '',
                    product_option_id: '',
                    price: 0.00,
                    validity: 0
                },
                productAttributeForm: {
                    id: -1,
                    value: '',
                    attribute_id: '',
                    status: 0
                },
                productOptions: [],
                productDiscounts: [],
                productAttributes: [],
                productCategories: [],
                uploadUrl: apiBaseUrl + 'products/image/upload',
                productImages: [],
                productFormRules: {
                    name: [
                        {required: true, message: 'Required', trigger: 'blur'}
                    ]
                },
                productOptionFormRules: {
                    name: [
                        {required: true, message: 'Required', trigger: 'blur'}
                    ],
                    /*       price: [
                     {required: true, message: 'Required', trigger: 'blur'}
                     ]*/
                },
                productAttributeFormRules: {
                    value: [
                        {required: true, message: 'Required', trigger: 'blur'}
                    ],
                    /*       price: [
                     {required: true, message: 'Required', trigger: 'blur'}
                     ]*/
                }
            }
        },
        methods: {
            onSubmit() {

            },
            handleClick(){

            },
            getImageUrl(){
                return productImagesUrl + this.productForm.image_url;
            },
            updateProductInformation (){
                this.$refs.productInformation.validate((valid) => {
                    if (valid) {
                        this.$confirm('Update product？', 'Save', {}).then(() => {
                            this.updatingProductInformation = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.productForm);
                            editProduct(para).then((res) => {
                                this.updatingProductInformation = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Updated. ',
                                    type: 'success'
                                });
                                this.$router.push(`/products`);
                            });
                        });
                    }
                });
            },
            saveProductInformation() {
                if (this.productForm.id !== -1) {
                    this.updateProductInformation();
                    return;
                }
                this.$refs.productInformation.validate((valid) => {
                    if (valid) {
                        this.$confirm('Add product？', 'Save', {}).then(() => {
                            this.savingProductInformation = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.productForm);
                            addProduct(para).then((res) => {
                                this.savingProductInformation = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Saved. ',
                                    type: 'success'
                                });
                                //TODO: redirect
                                this.$router.push(`/products`);
                            });
                        });
                    }
                });
            },
            saveProductOption() {
                if (this.productForm.id === -1) {
                    this.$message({
                        message: 'No product saved. Please submit product information first. ',
                        type: 'error'
                    });
                    return;
                }
                this.productOptionForm.product_id = this.productForm.id;
                if (this.productOptionForm.id !== -1) {
                    this.updateProductOption();
                    return;
                }
                this.$refs.productOption.validate((valid) => {
                    if (valid) {
                        this.$confirm('Add product option？', 'Save', {}).then(() => {
                            this.savingProductOption = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.productOptionForm);
                            addProductOption(para).then((res) => {
                                this.savingProductOption = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Saved. ',
                                    type: 'success'
                                });
                                this.getProductOptions();
                                this.$refs['productOption'].resetFields();
                                this.productOptionForm.id = -1;
                                //TODO: redirect
                                //  this.$router.push(`products/edit/${res.data.data.id}`);
                            });
                        });
                    }
                });
            },
            updateProductOption() {
                this.$refs.productOption.validate((valid) => {
                    if (valid) {
                        this.$confirm('Update product option？', 'Update', {}).then(() => {
                            this.savingProductOption = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.productOptionForm);
                            editProductOption(para).then((res) => {
                                console.log(res);
                                this.savingProductOption = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Saved. ',
                                    type: 'success'
                                });
                                this.getProductAttributes();
                            });
                        });
                    }
                });
            },
            saveProductAttribute() {
                if (this.productForm.id === -1) {
                    this.$message({
                        message: 'No product saved. Please submit product information first. ',
                        type: 'error'
                    });
                    return;
                }
                this.productAttributeForm.product_id = this.productForm.id;
                if (this.productAttributeForm.id !== -1) {
                    this.updateProductAttribute();
                    return;
                }
                this.$refs.attributeForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Add product attribute？', 'Save', {}).then(() => {
                            this.savingProductAttribute = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.productAttributeForm);
                            addProductAttribute(para).then((res) => {
                                this.savingProductAttribute = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Saved. ',
                                    type: 'success'
                                });
                                this.getProductAttributes();
                                this.$refs['attributeForm'].resetFields();
                                this.productAttributeForm.id = -1;
                                //TODO: redirect
                                //  this.$router.push(`products/edit/${res.data.data.id}`);
                            });
                        });
                    }
                });
            },
            updateProductAttribute(){
                this.$refs.attributeForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Update product attribute？', 'Update', {}).then(() => {
                            this.savingProductAttribute = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.productAttributeForm);
                            editProductAttribute(para).then((res) => {
                                this.savingProductAttribute = false;
                                //NProgress.done();
                                this.$message({
                                    message: 'Saved. ',
                                    type: 'success'
                                });
                                this.getProductAttributes();
                                this.$refs['attributeForm'].resetFields();
                                this.productAttributeForm.id = -1;

                            });
                        });
                    }
                });
            },
            clearOptionForm(){
                this.$refs['productOption'].resetFields();
                this.productOptionForm.id = -1;
            },
            clearAttributeForm(){
                this.$refs['attributeForm'].resetFields();
                this.productOptionForm.id = -1;
            },
            handleRemoveProductImage () {

            },
            saveProductDiscount() {

            },
            updateProductDiscount() {

            },
            handlePictureCardPreview () {

            },
            onProductImageUpload () {

            },
            uploadProductImages(file) {
                if (this.productForm.id === -1) {
                    this.$message({
                        message: 'No product saved. Please submit product information first. ',
                        type: 'error'
                    });
                    return false;
                }
                var data = new FormData();
                data.append('image', file);

                uploadFile({data: data, url: this.getProductImagesUploadUrl(), method: 'post'}).then((res) => {
                    var upload = res.data.data;
                    this.productImages.push({
                        id: upload.id,
                        name: upload.name,
                        url:  productImagesUrl +  upload.image_url
                    })
                });
                return false;
            },
            uploadProductImage(file) {
                if (this.productForm.id === -1) {
                    this.$message({
                        message: 'No product saved. Please submit product information first. ',
                        type: 'error'
                    });
                    return false;
                }
                var data = new FormData();
                data.append('image', file);

                uploadFile({data: data, url: this.getProductImageUploadUrl(), method: 'post'}).then((res) => {
                    this.productForm.image_url = res.data.data;
                    this.productImageUrl = this.getImageUrl();
                });
                return false;
            },
            getProductImageUploadUrl() {
                return apiBaseUrl + '/products/' + this.productForm.id + '/image/upload';
            },
            getProductImagesUploadUrl() {
                return apiBaseUrl + '/products/' + this.productForm.id + '/images/upload';
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleOptionEdit (index, row) {
                this.productOptionForm = {
                    name: row.name,
                    option_id: row.option_id,
                    description: row.description,
                    price: row.price,
                    id: row.id,
                    status: row.status
                };
            },
            handleOptionDelete (index, row) {
                deleteProductOption({id: row.id}).then((res) => {
                    this.$message({
                        message: 'Deleted. ',
                        type: 'success'
                    });
                    this.getProductOptions();
                });
            },
            handleAttributeEdit (index, row) {
                this.productAttributeForm = {
                    value: row.value,
                    attribute_id: row.attribute_id,
                    id: row.id,
                    status: row.status
                };
            },
            handleAttributeDelete (index, row) {
                deleteProductOption({id: row.id}).then((res) => {
                    this.$message({
                        message: 'Deleted. ',
                        type: 'success'
                    });
                    this.getProductOptions();
                });
            },
            getManufacturers(){
                getManufacturers({}).then((res) => {
                    //this.total = res.data.total;
                    this.manufacturers = res.data.data;
                    //NProgress.done();
                });
            },
            getCategories(){
                getCategories({}).then((res) => {
                    //this.total = res.data.total;
                    this.categories = res.data.data;
                    //NProgress.done();
                });
            },
            getAttributes(){
                getAttributes({}).then((res) => {
                    //this.total = res.data.total;
                    this.attributes = res.data.data;
                    //NProgress.done();
                });
            },
            getOptions(){
                getOptions({}).then((res) => {
                    //this.total = res.data.total;
                    this.options = res.data.data;
                    //NProgress.done();
                });
            },
            getProduct(id) {
                getProduct({id: id}).then((res) => {
                    //this.total = res.data.total;
                    this.productForm = res.data.data;
                    this.productImageUrl = this.getImageUrl();
                    var images = res.data.data.images
                    for (let img of images){
                        this.productImages.push({
                            name: img.name,
                            id: img.id,
                            url: productImagesUrl + img.image_url
                        })
                    }
                    this.getProductOptions();
                    this.getProductAttributes();
                    //NProgress.done();
                });
            },
            getProductOptions(){
                getProductOptions({id: this.productForm.id}).then((res) => {
                    //this.total = res.data.total;
                    this.productOptions = res.data.data;
                    console.log(this.productOptions);
                    //NProgress.done();
                });
            },
            getProductAttributes(){
                getProductAttributes({id: this.productForm.id}).then((res) => {
                    //this.total = res.data.total;
                    this.productAttributes = res.data.data;
                    //NProgress.done();
                });
            }
        },
        computed: {
            getUploadUrl(){
                return apiBaseUrl + '/products/image/upload/' + this.productForm.id;
            }
        },
        mounted() {
            if (this.$route.params.id) {
                this.getProduct(this.$route.params.id);
            }
            this.getManufacturers();
            this.getCategories();
            this.getAttributes();
            this.getOptions();

        },
        watch: {
            '$route': function (val, oldVal) {
                if (this.$route.params.id) {
                    this.getProduct(this.$route.params.id);
                }
            }
        }

    }
</script>
<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        margin: auto;
        width: 360px;
        height: 360px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 360px;
        height: 360px;
        display: block;
    }
</style>