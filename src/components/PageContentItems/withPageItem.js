import React, { Component } from 'react';

const withPageItem = () => (WrappedComponent) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        visible: true,
      };
    }

    render() {
      const { visible } = this.state;
      console.log(visible);
      return <WrappedComponent {...this.props} visible={visible} />;
    }
  };
};

export default withPageItem;
