import React from 'react';
import { connect } from 'react-redux';
import { addMessage, clearMessage } from 'actions';
import PropTypes from 'prop-types';

class Common extends React.PureComponent {
    render() {
        const { messages } = this.props;
        return (
            <div className="Common">
                {messages && messages.length > 0 && <span>팝업으로 표여줄 에러 메세지 : {messages[0].content}</span>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.message.messages,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearMessage: () => dispatch(clearMessage()),
        addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Common);

Common.defaultProps = {
    messages: [],
};

Common.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.string),
};
