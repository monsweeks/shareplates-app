import React from 'react';
import {connect} from 'react-redux';
import {addMessage, clearMessage,} from 'actions';

function Common(props) {
    console.log(props.messages);
    return (
        <div className="Common">
            {props.messages.length}
            {props.messages && props.messages.length > 0 && <span>{props.messages[0].category}</span>}
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