'use babel'

var Pololu = require('pololu-maestro');
var maestro = new Pololu('/dev/cu.usbmodem00059561', 115200);
var dualshock = require('dualshock-controller');
var React = require('react');
var Channel = require('./Channel');
var {Spring} = require("react-motion");

var controller = dualshock({ config : "dualShock3" });

//make sure you add an error event handler
controller.on('error', function(data) {
  console.log("Controller error:", data);
});

controller.connect();

var App = React.createClass({
  displayName: 'App',

  getInitialState() {
    return {
      selectedChannel: 0,
      channels: [{
        id: 0,
        name: 'R Foot',
        value: 1677,
        min: 950,
        max: 2000
      }, {
        id: 1,
        name: 'R Ankle',
        value: 2000,
        min: 950,
        max: 2000
      }, {
        id: 2,
        name: 'R Lower Knee',
        value: 1677,
        min: 950,
        max: 2000
      }, {
        id: 3,
        name: 'R Upper Knee',
        value: 1866,
        min: 950,
        max: 2000
      }, {
        id: 4,
        name: 'R Hip',
        value: 1290,
        min: 950,
        max: 2000
      }, {
        id: 5,
        name: 'R Torso',
        value: 1350,
        min: 950,
        max: 2000
      }, {
        id: 6,
        name: 'L Foot',
        value: 1491,
        min: 950,
        max: 2000
      }, {
        id: 7,
        name: 'L Ankle',
        value: 1379,
        min: 950,
        max: 2000
      }, {
        id: 8,
        name: 'L Lower Knee',
        value: 950,
        min: 950,
        max: 2000
      }, {
        id: 9,
        name: 'L Upper Knee',
        value: 998,
        min: 950,
        max: 2000
      }, {
        id: 10,
        name: 'L Hip',
        value: 1407,
        min: 950,
        max: 2000
      }, {
        id: 11,
        name: 'L Torso',
        value: 1410,
        min: 950,
        max: 2000
      }]
    }
  },

  onChange(channel, value) {
    this.state.channels[channel.id].value = value;
    this.setState({channels: this.state.channels});
  },

  onTween(channel, value) {
    maestro.setTarget(channel.id, value);
  },

  componentDidMount() {
    controller.on('dpadUp:press', (data) => {
      console.log("Controller up pressed:", data);
      this.setState({selectedChannel: Math.max(Math.min(this.state.selectedChannel - 1, this.state.channels.length), 0)});
    });

    controller.on('dpadDown:press', (data) => {
      console.log("Controller down pressed:", data);
      this.setState({selectedChannel: Math.max(Math.min(this.state.selectedChannel + 1, this.state.channels.length), 0)});
    });

    controller.on('dpadLeft:press', (data) => {
      console.log("Controller left pressed:", data);
      this.state.channels[this.state.selectedChannel].value = this.state.channels[this.state.selectedChannel].value - 30;
      this.setState({channels: this.state.channels});
    });

    controller.on('dpadRight:press', (data) => {
      console.log("Controller right pressed:", data);
      this.state.channels[this.state.selectedChannel].value = this.state.channels[this.state.selectedChannel].value + 30;
      this.setState({channels: this.state.channels});
    });
  },

  _renderChannels() {
    return this.state.channels.map(c => {
      return (
        <Spring key={c.id} endValue={{val: c.value}}>
          { interpolated =>
            <Channel
              onChange={this.onChange.bind(this, c)}
              onTween={this.onTween.bind(this, c)}
              value={Math.round(interpolated.val)}
              min={c.min}
              max={c.max}
              name={c.name}
              selected={c.id == this.state.selectedChannel} />
          }
        </Spring>
      )
    }, this);
  },

  render() {
    return (
      <div>
        {this._renderChannels()}
      </div>
    );
  }

});

maestro.on('ready', () => {
  console.log("Maestro ready!");
  React.render(<App/>, document.body);
});


// channel/servo config
// var channels = ;

// // map of id to channel
// var chIdMap = {};
// channels.forEach(function (ch) {
//   chIdMap[ch.id] = ch;
// });


// document.addEventListener('DOMContentLoaded', function() {

//   // wire up UI listeners
//   document.addEventListener('WebComponentsReady', function() {
//     Array.prototype.slice.call(document.querySelectorAll('my-channel')).forEach(function (channelEl) {
//       channelEl.addEventListener('change', function (e) {

//         // get the channel by id
//         var channel = chIdMap[e.detail.id];

//         channel.value = parseInt(e.detail.value);

//         // control servo
//         maestro.setTarget(channel.id, channel.value);
//       });
//     });
//   });

//   // set model on channel list
//   document.getElementById('tplChannelList').model = {
//     channels: channels
//   };

//   // get the polymer selection element
//   var listSelector = document.getElementById('listSelector');

//   // wire up ps3 channel selection & throttle
//   var ps3 = new PS3();

//   ps3.on('throttle', function (throttle) {
//     var channel = channels[listSelector.selected];
//     channel.value = Math.max(channel.min, Math.min(channel.max, channel.value + Math.round(throttle * 2)));
//   });

//   ps3.on('keypress', function (key) {
//     if (key === ps3.keys.triggers.DOWN) {
//       listSelector.selected = (listSelector.selected + 1) % channels.length;
//     } else if ( key === ps3.keys.triggers.UP) {
//       listSelector.selected = (listSelector.selected - 1) < 0 ? channels.length - 1 : listSelector.selected - 1;
//     }
//   });

//   ps3.read();

//   require('nw.gui').Window.get().on('close', function() {
//     try {
//       ps3.close();
//     } catch (e) { }
//     this.close(true);
//   });

// });
