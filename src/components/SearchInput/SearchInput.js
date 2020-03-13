import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './SearchInput.scss';

class SearchInput extends React.Component {
  focused = false;

  changed = false;

  constructor(props) {
    super(props);
    this.state = {
      focus: false,
    };
  }

  setSearchWord = (searchWord) => {
    const { onChange } = this.props;
    onChange(searchWord);
  };

  render() {
    const { className, onSearch, placeholder, onChange, componentClassName, color, noBorder, searchWord } = this.props;
    const { focus } = this.state;
    return (
      <div
        className={`${className} search-input-wrapper ${focus ? 'focused' : ''} ${
          searchWord ? 'has-value' : ''
        } color-${color} ${noBorder ? 'no-border' : ''}`}
      >
        <div className="placeholder">{placeholder}</div>
        <input
          className={componentClassName}
          type="text"
          value={searchWord}
          onChange={(e) => {
            if (this.focused) {
              this.changed = true;
            }
            onChange(e.target.value);
          }}
          onBlur={() => {
            setTimeout(() => {
              this.setState(
                {
                  focus: false,
                },
                () => {
                  if (this.changed) onSearch(searchWord);
                  this.changed = false;
                  this.focused = false;
                },
              );
            }, 100);
          }}
          onFocus={() => {
            this.focused = true;
            this.changed = false;
            this.setState({
              focus: true,
            });
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSearch(searchWord);
            }
          }}
        />
        <div
          className="clear-icon"
          onClick={() => {
            this.setSearchWord('');
            if (onChange) {
              onChange('');
            }
            if (onSearch) {
              onSearch('');
            }
          }}
        >
          <i className="fal fa-times" />
        </div>
        <div
          className="search-icon"
          onClick={() => {
            if (onSearch) {
              onSearch(searchWord);
            }
          }}
        >
          <i className="fal fa-search" />
        </div>
      </div>
    );
  }
}

export default withTranslation()(SearchInput);

SearchInput.defaultProps = {
  className: '',
  placeholder: '',
  componentClassName: '',
  color: 'gray',
  noBorder: false,
};

SearchInput.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  componentClassName: PropTypes.string,
  color: PropTypes.string,
  noBorder: PropTypes.bool,
  searchWord: PropTypes.string,
};
