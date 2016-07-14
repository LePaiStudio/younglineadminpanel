import Iconfont from '../iconfont';
import React, { PropTypes } from 'react';
import App from '../components/App';
import NotFound from '../components/NotFound';
import { Menu, Breadcrumb, Icon } from 'antd';
var locale = require('../locale');
const SubMenu = Menu.SubMenu;

var Routes = React.createClass({
  getInitialState() {
    return {onTab:'index_intro',breadcrumbIndex:locale.tabs.index,breadcrumbSecondIndex:locale.tabs.index_intro, openKeys:['index'], selectedKeys:['index_intro']};
  },
  routeOnOpen(info) {
    this.setState({
          openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
    });
  },
  routeOnSelect(info) {
    this.setState({
          selectedKeys: [info.key],
          breadcrumbIndex: locale.tabs[info.key.split('_')[0]],
          breadcrumbSecondIndex: locale.tabs[info.key]
    });
  },
  render() {
    return (
    <div className="ant-layout-aside">
      <aside className="ant-layout-sider">
        <div className="ant-layout-logo"><Iconfont type="youngline" /></div>
	        <Menu
            mode="inline"
            theme="dark"
            onOpen={this.routeOnOpen}
            onSelect={this.routeOnSelect}
            openKeys={this.state.openKeys}
	          selectedKeys={this.state.selectedKeys}>
	          <SubMenu key="index" title={<span><Icon type="home" />{locale.tabs.index}</span>}>
	          	<Menu.Item key="index_intro">{locale.tabs.index_intro}</Menu.Item>
              <Menu.Item key="index_charts">{locale.tabs.index_charts}</Menu.Item>
	          </SubMenu>
	          <SubMenu key="userManagement" title={<span><Icon type="user" />{locale.tabs.userManagement}</span>}>
	            <Menu.Item key="userManagement_manageUsers">{locale.tabs.userManagement_manageUsers}</Menu.Item>
              <Menu.Item key="userManagement_levelsManagement">{locale.tabs.userManagement_levelsManagement}</Menu.Item>
              <Menu.Item key="userManagement_authorityManagement">{locale.tabs.userManagement_authorityManagement}</Menu.Item>
	          </SubMenu>
            <SubMenu key="shopManagement" title={<span><Icon type="shopping-cart" />{locale.tabs.shopManagement}</span>}>
              <Menu.Item key="shopManagement_addCategory">{locale.tabs.shopManagement_addCategory}</Menu.Item>
              <Menu.Item key="shopManagement_manageCategories">{locale.tabs.shopManagement_manageCategories}</Menu.Item>
              <Menu.Item key="shopManagement_addItem">{locale.tabs.shopManagement_addItem}</Menu.Item>
              <Menu.Item key="shopManagement_manageItems">{locale.tabs.shopManagement_manageItems}</Menu.Item>
              <Menu.Item key="shopManagement_youngLineProductsManagement">{locale.tabs.shopManagement_youngLineProductsManagement}</Menu.Item>
            </SubMenu>
            <SubMenu key="contentManagement" title={<span><Icon type="file-text" />{locale.tabs.contentManagement}</span>}>
              <Menu.Item key="contentManagement_manageVideoes">{locale.tabs.contentManagement_manageVideoes}</Menu.Item>
              <Menu.Item key="contentManagement_manageParagraphs">{locale.tabs.contentManagement_manageParagraphs}</Menu.Item>
            </SubMenu>
            <SubMenu key="activitiesManagement" title={<span><Icon type="team" />{locale.tabs.activitiesManagement}</span>}>
              <Menu.Item key="activitiesManagement_manageActivities">{locale.tabs.activitiesManagement_manageActivities}</Menu.Item>
              <Menu.Item key="activitiesManagement_activityApproval">{locale.tabs.activitiesManagement_activityApproval}</Menu.Item>
            </SubMenu>
            <SubMenu key="marketingManagement" title={<span><Icon type="share-alt" />{locale.tabs.marketingManagement}</span>}>
              <Menu.Item key="marketingManagement_manageMarketingActivities">{locale.tabs.marketingManagement_manageMarketingActivities}</Menu.Item>
            </SubMenu>
            <SubMenu key="wechatManagement" title={<span><Iconfont type="weixin" />{locale.tabs.wechatManagement}</span>}>
              <Menu.Item key="wechatManagement_customMenu">{locale.tabs.wechatManagement_customMenu}</Menu.Item>
              <Menu.Item key="wechatManagement_vocabResponse">{locale.tabs.wechatManagement_vocabResponse}</Menu.Item>
              <Menu.Item key="wechatManagement_otherSettings">{locale.tabs.wechatManagement_otherSettings}</Menu.Item>
            </SubMenu>
            <SubMenu key="settings" title={<span><Icon type="setting" />{locale.tabs.settings}</span>}>
              <Menu.Item key="settings_system">{locale.tabs.settings_system}</Menu.Item>
              <Menu.Item key="settings_payment">{locale.tabs.settings_payment}</Menu.Item>
              <Menu.Item key="settings_sqlBackUp">{locale.tabs.settings_sqlBackUp}</Menu.Item>
            </SubMenu>
	        </Menu>
      </aside>
      <div className="ant-layout-main">
        <div className="ant-layout-header"></div>
        <div className="ant-layout-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>{this.state.breadcrumbIndex}</Breadcrumb.Item>
            <Breadcrumb.Item>{this.state.breadcrumbSecondIndex}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ant-layout-container">
          <div className="ant-layout-content">
            <div className="contentHeight">
              内容区域
            </div>
          </div>
        </div>
        <div className="ant-layout-footer">
        	{locale.routes_main.copyright}
        </div>
      </div>
    </div>
    );
  }
});


export default Routes;
