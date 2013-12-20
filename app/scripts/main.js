'use strict';

var PololuMaestro = require('pololu-maestro'),
    maestro = new PololuMaestro('/dev/cu.usbmodem00059561', 115200),
    PS3 = require('./scripts/ps3.js');


// channel/servo config
var channels = [{
  id: 0,
  name: 'Ch 0',
  value: 1500,
  min: 950,
  max: 2000
}, {
  id: 1,
  name: 'Ch 1',
  value: 1500,
  min: 950,
  max: 2000
}, {
  id: 2,
  name: 'Ch 2',
  value: 1500,
  min: 950,
  max: 2000
}, {
  id: 3,
  name: 'Ch 3',
  value: 1500,
  min: 950,
  max: 2000
}, {
  id: 4,
  name: 'Ch 4',
  value: 1500,
  min: 950,
  max: 2000
}];

// map of id to channel
var chIdMap = {};
channels.forEach(function (ch) {
  chIdMap[ch.id] = ch;
});


document.addEventListener('DOMContentLoaded', function() {

  // wire up UI listeners
  document.addEventListener('WebComponentsReady', function() {
    Array.prototype.slice.call(document.querySelectorAll('my-channel')).forEach(function (channelEl) {
      channelEl.addEventListener('change', function (e) {

        // get the channel by id
        var channel = chIdMap[e.detail.id];

        // validate the min/max
        if (channel.value < channel.min || channel.value > channel.max) {
          channel.value = Math.max(channel.min, Math.min(channel.max, channel.value));
        }

        // control servo
        maestro.setTarget(channel.id, channel.value);
      });
    });
  });

  // set model on channel list
  document.getElementById('tplChannelList').model = {
    channels: channels
  };

  // get the polymer selection element
  var listSelector = document.getElementById('listSelector');

  // wire up ps3 channel selection & throttle
  var ps3 = new PS3();

  ps3.on('throttle', function (throttle) {
    channels[listSelector.selected].value += Math.round(throttle);
  });

  ps3.on('keypress', function (key) {
    if (key === ps3.keys.triggers.UP) {
      listSelector.selected = (listSelector.selected + 1) % channels.length;
    } else if ( key === ps3.keys.triggers.DOWN) {
      listSelector.selected = (listSelector.selected - 1) < 0 ? channels.length - 1 : listSelector.selected - 1;
    }
  });

  ps3.read();

  require('nw.gui').Window.get().on('close', function() {
    ps3.close();
    this.close(true);
  });

});
