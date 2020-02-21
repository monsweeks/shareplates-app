import React from 'react';
import { connect } from 'react-redux';
import { addMessage, clearMessage, setLoading } from 'actions';
import PropTypes from 'prop-types';
import { Logo } from '@/components';

class Common extends React.PureComponent {
  render() {
    const { messages, loading } = this.props;

    return (
      <div className="Common">
        {messages && messages.length > 0 && <span>팝업으로 표여줄 에러 메세지 : {messages[0].content}</span>}
        {loading && (
          <div className="g-overlay">
            <div>
              <div>
                <Logo size="md" rotate text={<span>LOADING</span>} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.message.messages,
    loading: state.loading.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearMessage: () => dispatch(clearMessage()),
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    setLoading: (loading) => dispatch(setLoading(loading)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Common);

Common.defaultProps = {
  messages: [],
};

Common.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
};
