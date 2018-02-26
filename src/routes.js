import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Dashboard from './views/dashboard/Dashboard.vue'
import Categories from './views/catalog/Categories.vue'
import Options from './views/catalog/Options.vue'
import Products from './views/catalog/Products.vue'
import ProductForm from './views/catalog/ProductForm.vue'
import Attributes from './views/catalog/Attributes.vue'
import AttributeGroups from './views/catalog/AttributeGroups.vue'
import Manufacturers from './views/catalog/Manufacturers.vue'
import Orders from './views/sales/Orders.vue'
import OrderForm from './views/sales/OrderForm.vue'
import Banners from './views/catalog/Banners.vue'
import Customers from './views/customers/Customers.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
{
    path: '/login',
    component: Login,
    name: '',
    hidden: true
},
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: 'Home',
        leaf: true,
        iconCls: 'fa fa-dashboard',
        children: [{
            path: '/',
            component: Dashboard,
            name: 'Home'
        },]
    },
    {
        path: '/catalog',
        component: Home,
        name: 'Catalog',
        iconCls: 'fa fa-tag',
        children: [{
            path: '/categories',
            component: Categories,
            name: 'Categories'
        },
            {
                path: '/products',
                component: Products,
                name: 'Products'
            },
            {
                path: '/attributes/groups',
                component: AttributeGroups,
                name: 'Attribute Groups'
            },
            {
                path: '/attributes',
                component: Attributes,
                name: 'Attributes'
            },
            {
                path: '/options',
                component: Options,
                name: 'Options'
            },
            {
                path: '/manufacturers',
                component: Manufacturers,
                name: 'Manufacturers'
            },
            {
                path: '/banners',
                component: Banners,
                name: 'Banners'
            },
            {
                path: '/reviews',
                component: Page5,
                hidden: true,
                name: 'Reviews'
            },
            {
                path: '/products/add',
                hidden: true,
                component: ProductForm,
                name: 'Add Product'
            },
            {
                path: '/products/edit/:id',
                hidden: true,
                component: ProductForm,
                name: 'Edit Product'
            }
        ]
    },
    {
        path: '/sales',
        component: Home,
        name: 'Sales',
        iconCls: 'fa fa-shopping-cart',
        children: [{
            path: '/orders',
            component: Orders,
            name: 'Orders'
        },
            {
                path: '/orders/:id',
                component: OrderForm,
                hidden: true,
                name: 'Order'
            },
            {
                path: '/returns',
                component: Page6,
                name: 'Returns'
            },
            {
                path: '/coupons',
                component: Page6,
                name: 'Coupons'
            }
        ]
    },
    {
        path: '/customers',
        component: Home,
        name: 'Customers',
        iconCls: 'fa fa-users',
        children: [{
            path: '/customers',
            component: Page6,
            name: 'Customers'
        },{
            path: '/customers/views',
            component: Page6,
            name: 'Customer views'
        },{
            path: '/customers/visits',
            component: Page6,
            name: 'Site Visits'
        }]
    },
    {
        path: '/reports',
        component: Home,
        name: 'Reports',
        leaf: true,
        iconCls: 'fa fa-bar-chart',
        children: [{
            path: '/reports',
            component: echarts,
            name: 'Reports'
        }]
    },
    {
        path: '/settings',
        component: Home,
        name: 'Settings',
        iconCls: 'fa fa-cog',
        children: [{
            path: '/configurations',
            component: echarts,
            name: 'Configurations'
        },
            {
                path: '/users',
                component: echarts,
                name: 'Users'
            }
        ]
    },
    {
        path: '/charts',
        component: Home,
        name: 'Charts',
        hidden: true,
        iconCls: 'fa fa-bar-chart',
        children: [{
            path: '/echarts',
            component: echarts,
            name: 'echarts'
        }]
    },
    {
        path: '*',
        hidden: true,
        redirect: {
            path: '/404'
        }
    }
];

export default routes;
