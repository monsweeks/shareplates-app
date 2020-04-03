import React, { Component } from 'react';

const withPageItem = () => (WrappedComponent) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        // eslint-disable-next-line react/prop-types
        options: { ...props.item.options },
        // eslint-disable-next-line react/prop-types
        editable: props.editable,
      };
    }

    static setting = WrappedComponent.setting;

    static itemName = WrappedComponent.name;

    render() {
      const { options, editable } = this.state;
      console.log(options, editable);
      return <div className='w-100 h-100'><WrappedComponent style={options} {...this.props} /></div>;
    }
  };
};

withPageItem.options = {
  verticalAlign: 'verticalAlign',
  textAlign: 'textAlign',
  color: 'color',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  padding: 'padding',
  backgroundColor: 'backgroundColor',
};

export default withPageItem;
