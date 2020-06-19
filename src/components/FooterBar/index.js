import { Icon, TabBar } from '@ant-design/react-native';
import { connect, routerRedux } from 'dva';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Links from '../../constants/Links';
import themes from '../../themes';

@connect()
export default class FooterBar extends React.PureComponent {
  static propTapes = { currentLink: PropTypes.string.isRequired };

  state = {
    buttons: [
      {
        title: '首页',
        link: Links.HOME,
        icon: <Icon name={'home'} />,
      },
      {
        title: '设置',
        link: Links.SETTING,
        icon: <Icon name={'setting'} />,
      },
    ],
  };

  handleClick = (link) => {
    this.props.dispatch(routerRedux.push(link));
  };

  render() {
    const { buttons } = this.state;
    return (
      <TabBar
        barTintColor={`${themes.color_light_green}33`}
        unselectedTintColor={'#6d6d6d'}
        tintColor={themes.color_font_primary}
      >
        {buttons.map(({ title, link, icon }, index) => {
          const { currentLink } = this.props;
          const isSelected = currentLink === link || (link !== '/' && _.startsWith(currentLink, link));
          return (
            <TabBar.Item
              key={index} title={title} icon={icon} onPress={() => { this.handleClick(link); }}
              selected={isSelected}
            />
          );
        })}
      </TabBar>
    );
  }
}
