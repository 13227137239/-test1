import Vue from 'vue'
import { Button,Row,Form,FormItem,Input,Message,
    Container,Header,Aside,Main,Footer,Menu,Submenu,
    MenuItem,Breadcrumb,BreadcrumbItem,Card,Col,Table,
    TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox
} from 'element-ui'
Vue.use(Dialog)
Vue.use(MenuItem)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
// 弹框提示
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm