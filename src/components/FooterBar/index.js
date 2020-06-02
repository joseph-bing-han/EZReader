import { Icon, TabBar } from '@ant-design/react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Links from '../../constants/Links';

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

  };

  render() {
    const { buttons } = this.state;
    return (
      <TabBar>
        {buttons.map(({ title, link, icon }, index) => (
          <TabBar.Item key={index} title={title} icon={icon} onPress={this.handleClick(link)}
            selected={_.startsWith(this.props.currentLink, link)} />
        ))}
      </TabBar>
    );
  }
}
