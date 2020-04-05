import React from 'react';
import PropTypes from 'prop-types';
import './Text.scss';
import withPageItem from '@/components/PageContentItems/withPageItem';

class Text extends React.PureComponent {
  render() {
    const { className, item, style, editable } = this.props;

    console.log(item);

    return (
      <div className={`text-wrapper ${className} ${editable ? 'editable' : ''}`} {...item} style={style}>
        <div>
          <div>텍스트를 입력해주세요.</div>
        </div>
      </div>
    );
  }
}

Text.defaultProps = {
  className: '',
};

Text.propTypes = {
  className: PropTypes.string,
  item: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  editable : PropTypes.bool,
};

// 편집 가능한 옵션과 그 옵션들의 기본값 세팅
const pageItemProps = {};
pageItemProps[withPageItem.options.textAlign] = 'left';
pageItemProps[withPageItem.options.fontFamily] = 'LGSmHaL';
pageItemProps[withPageItem.options.fontSize] = '1rem';
pageItemProps[withPageItem.options.color] = '#000000';

pageItemProps[withPageItem.options.verticalAlign] = 'middle';
pageItemProps[withPageItem.options.padding] = '1rem';
pageItemProps[withPageItem.options.backgroundColor] = 'white';

Text.setting = {
  w: 120,
  h: 4,
  pageItemProps,
};

export default withPageItem()(Text);
