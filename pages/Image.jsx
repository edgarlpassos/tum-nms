import React from 'react';


export default class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  };

  render() {
    return (
      <div>
        <h2>Image.jsx</h2>
        <img src={ this.props.url } />
      </div>
    );
  }
}
