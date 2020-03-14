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

  search = () => {
    const { onSearch } = this.props;
    this.changed = false;
    onSearch();
  };

  render() {
    const { className, placeholder, onChange, componentClassName, color, noBorder, searchWord } = this.props;
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
                  if (this.changed) this.search();
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
              this.search();
            }
          }}
        />
        <div
          className="clear-icon"
          onClick={() => {
            onChange('');
            this.search();
          }}
        >
          <i className="fal fa-times" />
        </div>
        <div
          className="search-icon"
          onClick={() => {
            this.search();
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
