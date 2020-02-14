import React from 'react';
import {connect} from 'react-redux';
import {addMessage, clearMessage,} from 'actions';

function Common(props) {
    return (
        <div className="Common">
            {props.messages && props.messages.length > 0 && <span>팝업으로 표여줄 에러 메세지 : {props.messages[0].content}</span>}
        </div>
    );
}

let mapStateToProps = (state) => {
    return {
        messages: state.message.messages,
    };
};

let mapDispatchToProps = (dispatch) => {
    return {
        clearMessage: () => dispatch(clearMessage()),
        addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    };
};

Common = connect(mapStateToProps, mapDispatchToProps)(Common);

export default Common;