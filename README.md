servo-ui
========

Simple desktop application for controlling servos, built with node-webkit.

Currently only supports pololu servo controllers and a PS3 controller.

![image](https://f.cloud.github.com/assets/848347/1793272/857c323c-69af-11e3-990a-d38195c36fae.png)


### Install
```
$ npm install
$ bower install
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



