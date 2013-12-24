servo-ui
========

Simple desktop application for controlling servos, built with node-webkit.

Currently only supports pololu servo controllers and a PS3 controller.

![image](https://f.cloud.github.com/assets/848347/1794518/ffdd26d6-69cc-11e3-9967-2f82bdf9a3ae.png)


### Install
```
npm install
bower install
```

Node modules with native dependencies have to be rebuilt using nw-gyp. 

In these directories:

```
node_modules/pololu-maestro/node_modules/serialport
node_modules/node-hid
```

do:

```
nw-gyp rebuild --target=0.8.2
```
where 'target' is your node-webkit version. See https://github.com/rogerwang/node-webkit/wiki/Build-native-modules-with-nw-gyp

### Run
See https://github.com/rogerwang/node-webkit/wiki/How-to-run-apps

### Release
```
grunt
```

