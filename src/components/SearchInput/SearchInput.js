import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './SearchInput.scss';

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      searchWord : '',
    };
  }

  setSearchWord = (searchWord) => {
    this.setState({
      searchWord,
    });
  };

  render() {
    const { className, onSearch } = this.props;
    const { focus, searchWord } = this.state;
    return (
      <div className={`${className} search-input-wrapper ${focus ? 'focused' : ''}`}>
        <input
          type="text"
          value={searchWord}
          onChange={(e) => {
            this.setSearchWord(e.target.value);
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
        />
        <div
          className="clear-icon"
          onClick={() => {
            console.log(1);
            this.setSearchWord('');
          }}
        >
          <i className="fal fa-times" />
        </div>
        <div
          className="search-icon"
          onClick={() => {
            onSearch(searchWord);
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
};

SearchInput.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func,
};
