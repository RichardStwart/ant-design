import * as React from 'react';
import RcDropdown from 'rc-dropdown';
import splitObject from '../_util/splitObject';

export default class Dropdown extends React.Component {
  static defaultProps = {
    transitionName: 'slide-up',
    prefixCls: 'ant-dropdown',
    mouseEnterDelay: 0.15,
    mouseLeaveDelay: 0.1,
  };

  render() {
    return <RcDropdown {...this.props} />;
  }
}
