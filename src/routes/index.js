import React, { PropTypes } from 'react';
import App from '../components/App';
import NotFound from '../components/NotFound';
import { Menu, Breadcrumb, Icon } from 'antd';
var locale = require('../locale');
const SubMenu = Menu.SubMenu;

const Routes = ({ history }) =>
    <div className="ant-layout-aside">
      <aside className="ant-layout-sider">
        <div className="ant-layout-logo"></div>
	        <Menu mode="inline" theme="dark"
	          defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
	          <SubMenu key="sub1" title={<span><Icon type="user" />{locale.tabs.shouye}</span>}>
	          	<Menu.Item key="1">{locale.tabs.gaikuang}</Menu.Item>
	          </SubMenu>
	          <SubMenu key="sub2" title={<span><Icon type="laptop" />导航二</span>}>
	            <Menu.Item key="5">选项5</Menu.Item>
	            <Menu.Item key="6">选项6</Menu.Item>
	            <Menu.Item key="7">选项7</Menu.Item>
	            <Menu.Item key="8">选项8</Menu.Item>
	          </SubMenu>
	          <SubMenu key="sub3" title={<span><Icon type="notification" />导航三</span>}>
	            <Menu.Item key="9">选项9</Menu.Item>
	            <Menu.Item key="10">选项10</Menu.Item>
	            <Menu.Item key="11">选项11</Menu.Item>
	            <Menu.Item key="12">选项12</Menu.Item>
	          </SubMenu>
	        </Menu>
      </aside>
      <div className="ant-layout-main">
        <div className="ant-layout-header"></div>
        <div className="ant-layout-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>{locale.tabs.shouye}</Breadcrumb.Item>
            <Breadcrumb.Item>{locale.tabs.gaikuang}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ant-layout-container">
          <div className="ant-layout-content">
            <div style={{ height: 590 }}>
              内容区域
            </div>
          </div>
        </div>
        <div className="ant-layout-footer">
        	{locale.routes_main.copyright}
        </div>
      </div>
    </div>;

Routes.propTypes = {
  history: PropTypes.any,
};

export default Routes;
