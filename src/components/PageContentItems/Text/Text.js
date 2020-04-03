import React from 'react';
import PropTypes from 'prop-types';
import './Text.scss';
import withPageItem from '@/components/PageContentItems/withPageItem';

class Text extends React.PureComponent {
  render() {
    const { className, item, style } = this.props;

    console.log(item);

    return (
      <div className={`text-wrapper ${className}`} {...item} style={style}>
        <div>TEXTEXT</div>
      </div>
    );
  }
}

Text.propTypes = {
  className: PropTypes.string,
  item: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
};

// 편집 가능한 옵션과 그 옵션들의 기본값 세팅
const pageItemProps = {};
pageItemProps[withPageItem.options.verticalAlign] = 'middle';
pageItemProps[withPageItem.options.textAlign] = 'center';
pageItemProps[withPageItem.options.color] = 'red';
pageItemProps[withPageItem.options.fontFamily] = '';
pageItemProps[withPageItem.options.fontSize] = '1rem';
pageItemProps[withPageItem.options.padding] = '0';
pageItemProps[withPageItem.options.backgroundColor] = 'white';

Text.setting = {
  w: 120,
  h: 4,
  pageItemProps,
};

export default withPageItem()(Text);
