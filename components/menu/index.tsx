import React from 'react';
import RcMenu, { Item, Divider, SubMenu, ItemGroup } from 'rc-menu';
import classNames from 'classnames';
import animation from '../_util/openAnimation';
import warning from '../_util/warning';

export interface SelectParam {
  key: string;
  keyPath: Array<string>;
  item: any;
  domEvent: any;
  selectedKeys: Array<string>;
}

export interface ClickParam {
  key: string;
  keyPath: Array<string>;
  item: any;
  domEvent: any;
}

export interface MenuProps {
  id?: string;
  /** `light` `dark` */
  theme?: 'light' | 'dark';
  /** enum: `vertical` `horizontal` `inline` */
  mode?: 'vertical' | 'horizontal' | 'inline';
  selectedKeys?: Array<string>;
  defaultSelectedKeys?: Array<string>;
  openKeys?: Array<string>;
  defaultOpenKeys?: Array<string>;
  onOpenChange?: (openKeys: string[]) => void;
  onSelect?: (param: SelectParam) => void;
  onDeselect?: (param: SelectParam) => void;
  onClick?: (param: ClickParam) => void;
  style?: React.CSSProperties;
  openAnimation?: string | Object;
  openTransitionName?: string | Object;
  className?: string;
  prefixCls?: string;
  multiple?: boolean;
  inlineIndent?: number;
  inlineCollapsed?: boolean;
}

export default class Menu extends React.Component<MenuProps, any> {
  static Divider = Divider;
  static Item = Item;
  static SubMenu = SubMenu;
  static ItemGroup = ItemGroup;
  static defaultProps = {
    prefixCls: 'ant-menu',
    className: '',
    theme: 'light',  // or dark
  };
  switchModeFromInline: boolean;
  inlineOpenKeys = [];
  constructor(props) {
    super(props);

    warning(
      !('onOpen' in props || 'onClose' in props),
      '`onOpen` and `onClose` are removed, please use `onOpenChange` instead, ' +
      'see: http://u.ant.design/menu-on-open-change.',
    );

    let openKeys;
    if ('defaultOpenKeys' in props) {
      openKeys = props.defaultOpenKeys;
    } else if ('openKeys' in props) {
      openKeys = props.openKeys;
    }

    this.state = {
      openKeys: openKeys || [],
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.mode === 'inline' &&
        nextProps.mode !== 'inline') {
      this.switchModeFromInline = true;
    }
    if (nextProps.inlineCollapsed && !this.props.inlineCollapsed) {
      this.switchModeFromInline = true;
      this.inlineOpenKeys = this.state.openKeys;
      this.setState({ openKeys: [] });
    }
    if (!nextProps.inlineCollapsed && this.props.inlineCollapsed) {
      this.setState({ openKeys: this.inlineOpenKeys });
      this.inlineOpenKeys = [];
    }
    if ('openKeys' in nextProps) {
      this.setState({ openKeys: nextProps.openKeys });
    }
  }
  handleClick = (e) => {
    this.setOpenKeys([]);

    const { onClick } = this.props;
    if (onClick) {
      onClick(e);
    }
  }
  handleOpenChange = (openKeys: string[]) => {
    this.setOpenKeys(openKeys);

    const { onOpenChange } = this.props;
    if (onOpenChange) {
      onOpenChange(openKeys);
    }
  }
  setOpenKeys(openKeys) {
    if (!('openKeys' in this.props)) {
      this.setState({ openKeys });
    }
  }
  getRealMenuMode() {
    const { mode, inlineCollapsed } = this.props;
    return inlineCollapsed ? 'vertical' : mode;
  }
  getMenuOpenAnimation() {
    const { openAnimation, openTransitionName } = this.props;
    const menuMode = this.getRealMenuMode();
    let menuOpenAnimation = openAnimation || openTransitionName;
    if (openAnimation === undefined && openTransitionName === undefined) {
      switch (menuMode) {
        case 'horizontal':
          menuOpenAnimation = 'slide-up';
          break;
        case 'vertical':
          // When mode switch from inline
          // submenu should hide without animation
          if (this.switchModeFromInline) {
            menuOpenAnimation = '';
            this.switchModeFromInline = false;
          } else {
            menuOpenAnimation = 'zoom-big';
          }
          break;
        case 'inline':
          menuOpenAnimation = animation;
          break;
        default:
      }
    }
    return menuOpenAnimation;
  }
  render() {
    const { inlineCollapsed, prefixCls, className, theme } = this.props;
    const menuMode = this.getRealMenuMode();
    const menuOpenAnimation = this.getMenuOpenAnimation();

    const menuClassName = classNames(className, `${prefixCls}-${theme}`, {
      [`${prefixCls}-inline-collapsed`]: inlineCollapsed,
    });

    const menuProps: MenuProps = {
      openKeys: this.state.openKeys,
      onClick: this.handleClick,
      onOpenChange: this.handleOpenChange,
      className: menuClassName,
      mode: menuMode,
    };

    if (menuMode !== 'inline') {
      // closing vertical popup submenu after click it
      menuProps.onClick = this.handleClick;
      menuProps.openTransitionName = menuOpenAnimation;
    } else {
      menuProps.openAnimation = menuOpenAnimation;
    }

    return <RcMenu {...this.props} {...menuProps} />;
  }
}
