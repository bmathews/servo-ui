servo-ui
========

Simple desktop application for controlling servos, built with node-webkit.

Currently only supports pololu servo controllers and a PS3 controller.

![image](https://f.cloud.github.com/assets/848347/1793995/c3c8dd4c-69be-11e3-8f93-9d0962688af6.png)


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



