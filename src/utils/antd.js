import Vue from 'vue'
import {
  Button,
  Row,
  Col,
  Card,
  Pagination,
  Upload,
  Menu,
  Form,
  FormModel,
  DatePicker,
  Select,
  Tree,
  TreeSelect,
  Tooltip,
  Modal,
  Dropdown,
  Input,
  Divider,
  Spin,
  Alert,
  Tabs,
  Radio,
  Popconfirm,
  Steps,
  Icon,
  Cascader,
  message,
  notification,
  ConfigProvider,
  Layout,
  Badge,
  Avatar,
  Drawer,
  Tag,
  List,
  Switch,
  Checkbox,
  Table,
  InputNumber,
  Collapse,
  Affix,
  BackTop,
  Skeleton,
  Popover,
  Carousel,
  Comment,
  Statistic,
  Anchor,
  Timeline,
  TimePicker,
  Slider,
  Rate
} from 'ant-design-vue'

Vue.use(Popover);
Vue.use(Skeleton);
Vue.use(BackTop);
Vue.use(Affix);
Vue.use(Collapse);
Vue.use(InputNumber);
Vue.use(Table);
Vue.use(Checkbox);
Vue.use(Switch);
Vue.use(List);
Vue.use(Tag);
Vue.use(Drawer);
Vue.use(Avatar);
Vue.use(Badge);
Vue.use(Layout);
Vue.use(ConfigProvider);
Vue.use(Icon);
Vue.use(Steps);
Vue.use(Popconfirm);
Vue.use(Radio);
Vue.use(Tabs);
Vue.use(Alert);
Vue.use(Spin);
Vue.use(Divider);
Vue.use(Input);
Vue.use(Dropdown);
Vue.use(Modal);
Vue.use(Tooltip);
Vue.use(TreeSelect);
Vue.use(Tree);
Vue.use(Select);
Vue.use(DatePicker);
Vue.use(FormModel);
Vue.use(Form);
Vue.use(Menu);
Vue.use(Row);
Vue.use(Upload);
Vue.use(Row);
Vue.use(Pagination);
Vue.use(Col);
Vue.use(Card);
Vue.use(Button);
Vue.use(Carousel);
Vue.use(Comment);
Vue.use(Statistic);
Vue.use(Anchor);
Vue.use(Timeline);
Vue.use(Cascader);
Vue.use(TimePicker);
Vue.use(Slider);
Vue.use(Rate);
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;