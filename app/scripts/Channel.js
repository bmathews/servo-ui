var React = require('react');
var ReactSlider = require('react-slider');

var Channel = React.createClass({
  displayName: 'Channel',

  propTypes: {
    value: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onTween: React.PropTypes.func.isRequred
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.value != this.props.value) {
      this.props.onTween(nextProps.value);
    }
  },

  render: function () {
    return (
      <div className={"channel " + (this.props.selected ? "channel--selected" : "")}>
        <div className="channel-name">
          {this.props.name}
        </div>
        <ReactSlider
          className="channel-slider"
          {...this.props}
          withBars />
        <div className="channel-value">
          {this.props.value}
        </div>
      </div>
    );
  }

});

module.exports = Channel;
