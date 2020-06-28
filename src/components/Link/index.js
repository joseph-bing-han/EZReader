import { connect, routerRedux } from 'dva';
import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity } from 'react-native';

@connect()
export default class Link extends React.PureComponent {
  static propTapes = { linkTo: PropTypes.string.isRequired };

  handlePress = () => {
    this.props.dispatch(routerRedux.push(this.props.linkTo));
  };

  render() {
    return (
      <TouchableOpacity onPress={this.handlePress}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
