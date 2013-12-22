'use strict';

var util = require('util'),
    events = require('events'),
    HID = require('node-hid');

var READ_SPEED = 10,
    JOYSTICK_THRESHOLD = 20;

function convertRange(val, oldMin, oldMax, newMin, newMax) {
  return (((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
}

module.exports = function () {

  var devices = HID.devices(),
      path,
      controller;

  devices.forEach(function(dev) {
    if (dev.product === 'PLAYSTATION(R)3 Controller') {
      path = dev.path;
    }
  });

  function PS3() {
    events.EventEmitter.call(this);
    if (path) {
      controller = new HID.HID(path);
      this.read();
    } else {
      console.log('No PS3 controller found.');
    }

    this.keysDown = {};
  }

  util.inherits(PS3, events.EventEmitter);

  PS3.prototype.keypress = function(val) {
    this.emit('keypress', val);
  };

  PS3.prototype.throttle = function (val) {
    var temp = -(val - 128),
        throttle = 0;

    if (temp < JOYSTICK_THRESHOLD / -2 || temp > JOYSTICK_THRESHOLD / 2) {
      throttle = convertRange(temp, -128, 128, -20, 20);
      this.emit('throttle', throttle);
    }
  };

  PS3.prototype.close = function () {
    if (controller) {
      controller.close();
    }
  };

  PS3.prototype.read = function () {
    var _this = this;
    if (controller) {
      controller.read(function(err, data) {
        if (err) { console.error(err); }

        [_this.keys.triggers.UP, _this.keys.triggers.DOWN].forEach(function (key) {
          if (data[key] > 0) {
            if (!_this.keysDown[key]) {
              _this.keypress(key);
            }
            _this.keysDown[key] = true;
          } else {
            _this.keysDown[key] = false;
          }
        });

        _this.throttle(data[_this.keys.triggers.RIGHT_STICK_Y]);

        setTimeout(function() {
          _this.read();
        }, READ_SPEED);
      });
    }
  };

  PS3.prototype.keys = {
    resolution: 256,
    triggers: {
      LEFT_LK: 2,
      RIGHT_LK: 3,
      PS: 4,
      L1: 20,
      L2: 18,
      R1: 21,
      R2: 19,
      UP: 14,
      DOWN: 16,
      LEFT: 17,
      RIGHT: 15,
      TRIANGLE: 22,
      SQUARE: 25,
      CIRCLE: 23,
      CROSS: 24,
      LEFT_STICK_X: 6,
      LEFT_STICK_Y: 7,
      RIGHT_STICK_X: 8,
      RIGHT_STICK_Y: 9,
      AXIS_ROLL: 42,
      AXIS_PITCH: 44,
      WIGGLE: 46
    },
    leftKeys: {
      UP: 16,
      DOWN: 64,
      LEFT: 28,
      RIGHT: 32,
      LEFT_STICK: 2,
      RIGHT_STICK: 4,
      SELECT: 1,
      START: 8
    },
    rightKeys: {
      L1: 4,
      L2: 1,
      R1: 8,
      R2: 2,
      TRIANGLE: 16,
      SQUARE: 128,
      CIRCLE: 32,
      CROSS: 64
    }
  };
  return new PS3();
};