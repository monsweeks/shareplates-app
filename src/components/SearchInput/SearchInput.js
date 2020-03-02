import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './SearchInput.scss';

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      searchWord: '',
    };
  }

  setSearchWord = (searchWord) => {
    this.setState({
      searchWord,
    });
  };

  render() {
    const { className, onSearch, placeholder, onChange } = this.props;
    const { focus, searchWord } = this.state;
    return (
      <div className={`${className} search-input-wrapper ${focus ? 'focused' : ''} ${searchWord ? 'has-value' : ''}`}>
        <div className="placeholder">{placeholder}</div>
        <input
          type="text"
          value={searchWord}
          onChange={(e) => {
            this.setSearchWord(e.target.value);
            if (onChange) {
              onChange(e.target.value);
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              this.setState({
                focus: false,
              });
            }, 100);
          }}
          onFocus={() => {
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
};

SearchInput.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};
