import Vue from 'vue'
import { Button,Row,Form,FormItem,Input,Message,
    Container,Header,Aside,Main,Footer,Menu,Submenu,
    MenuItem,Breadcrumb,BreadcrumbItem,Card,Col,Table,
    TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,
    Tag,Tree,Select,Option,Cascader,Alert,Tabs,TabPane,Steps,Step,CheckboxGroup,Checkbox,
    Upload,Timeline,TimelineItem


} from 'element-ui'
Vue.use(Dialog)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Upload)
Vue.use(Step)
Vue.use(Steps)
Vue.use(CheckboxGroup)
Vue.use(TabPane)
Vue.use(Checkbox)
Vue.use(Tabs)
Vue.use(Select)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Tree)
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