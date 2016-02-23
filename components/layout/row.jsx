import React, { Children, cloneElement } from 'react';
import classNames from 'classnames';

const Row = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    align: React.PropTypes.string,
    justify: React.PropTypes.string,
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    gutter: React.PropTypes.number,
  },
  getDefaultProps() {
    return {
      gutter: 0,
    };
  },
  render() {
    const { type, justify, align, className, gutter, style, children, ...others } = this.props;
    const classes = classNames({
      row: true,
      [`row-${type}`]: type,
      [`row-${type}-${justify}`]: justify,
      [`row-${type}-${align}`]: align,
      [className]: className,
    });
    const rowStyle = gutter > 0 ? {
      marginLeft: gutter / -2,
      marginRight: gutter / -2,
      ...style,
    } : style;
    const cols = Children.map(children, col =>
      cloneElement(col, {
        style: gutter > 0 ? {
          paddingLeft: gutter / 2,
          paddingRight: gutter / 2,
        } : null
      })
    );
    return <div {...others} className={classes} style={rowStyle}>{cols}</div>;
  },
});

export default Row;
