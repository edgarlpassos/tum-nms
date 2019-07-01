import React from 'react';


export default class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  };

  static defaultProps = {
    poster: null,
    src: null,
    width: 640,
    height: 360,
    className: null,
    controls: true,
    loop: true,
    autoPlay: true,
    preload: 'auto',
  };

  createVideoElem() {
    if(!this.props.src)
      return <p>No video source specified...</p>;

    return(
      <video
        width     = { this.props.width }
        height    = { this.props.height }
        className = { this.props.className }
        loop      = { this.props.loop }
        autoPlay  = { this.props.autoplay }
        controls  = { this.props.controls }
        preload   = { this.props.auto }
      >
        <source src={ this.props.src } type={ this.props.type } />
        Your browser does not support the video tag.
      </video>
    );
  }

  render() {
    return (
      <div>
        <h2>Video.jsx</h2>
        { this.createVideoElem() }
      </div>
    );
  }
}
