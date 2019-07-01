import React from 'react';


export default class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  };

  getImageURL() {
    const params = {
      Bucket: this.props.bucket,
      Key: this.props.file,
    };

    return this.props.s3.getSignedUrl('getObject', params);
  }

  render() {
    return (
      <div>
        <img src={ this.getImageURL() } />
      </div>
    );
  }
}
