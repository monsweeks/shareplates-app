import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './PageEditorShortKeyInfo.scss';

class PageEditorShortKeyInfo extends React.PureComponent {
  render() {
    const { t, className } = this.props;

    return (
      <div className={`short-key-guide-wrapper ${className}`}>
        <div className="title">{t('단축키 정보')}</div>
        <div>
          <span>Alt + N</span>
          <div>
            <div>새 페이지</div>
            <div>(페이지 목록에서)</div>
          </div>
        </div>
        <div>
          <span>Del</span>
          <div>
            <div>페이지 삭제</div>
            <div>(페이지 선택 후)</div>
          </div>
        </div>
        <div>
          <span>Ctrl + S</span>
          <div>
            <div>페이지 저장</div>
            <div>(페이지 선택 후)</div>
          </div>
        </div>
        <div>
          <span>Ctrl + C</span>
          <div>
            <div>아이템 복사</div>
            <div>(아이템 선택 후)</div>
          </div>
        </div>
        <div>
          <span>Ctrl + V</span>
          <div>
            <div>아이템 붙여넣기</div>
            <div>(아이템 복사 후)</div>
          </div>
        </div>
        <div>
          <span>Ctrl + Z</span>
          <div>
            <div>편집 되돌리기</div>
            <div>(컨텐츠 편집 후)</div>
          </div>
        </div>
        <div>
          <span>Ctrl + Y</span>
          <div>
            <div>편집 재적용</div>
            <div>(편집 되돌리기 후)</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(PageEditorShortKeyInfo);

PageEditorShortKeyInfo.defaultProps = {
  className: '',
};

PageEditorShortKeyInfo.propTypes = {
  t: PropTypes.func,
  className: PropTypes.string,
};
