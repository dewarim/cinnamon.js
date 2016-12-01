# cinnamon.js

A JavaScript client UI for the Cinnamon CMS

# Introduction

This is an experimental client for the [Cinnamon CMS](http://cinnamon-cms.com).

I want to write some advanced webclient features and also extend my JavaScript knowledge.

The goal is to have a client library

* which can be used for fat Cinnamon applications, for example editing complex Cinnamon object graphs in the browser (DITA, S1000D, XML);
* which exposes core Cinnamon object types to improve the existing webclient, for example a dynamic search builder;
* which contains a collection of tests for the XML server API.

# Getting started

* check out this repository
* install node.js in your PATH, so you can run "npm" from the command line
* run "npm install"
* run "npm run dev" to start a development web server at [http://localhost:3030/](http://localhost:3030/)
 
## Prerequisites

You need a running Cinnamon server. You can download Cinnamon Portable for Windows (no permanent installation required) from 
[dewarim.com](http://dewarim.com/index.php/34-cinnamon-portable-preview-3-7), 
which also contains the demo repository with user admin (password: admin).

After downloading, set the security flag with right-click on the archive, unpack it and double-click cinnamon.bat.

# Project status

The project is in pre-alpha status. 
It can connect to a Cinnamon repository and fetch several object lists (Acls, FolderTypes, ObjectTypes) 
which are essential to building more complex classes.

I am currently revisiting the project and rewriting it while learning react.js.   

# Technology Stack

## Old version 

(see: index.html and js folder)
                                       
* [jQuery 2.0.0](http://jquery.com)
* [QUnit 1.11](http://qunitjs.com)

## React stack and further dependencies

New version

* node.js and npm
* react.js
* redux
* babel
* webpack and webpack-dev-server
* react-router
* mocha
* chai

# License

Apache 2.0 License

# Author and Contact

* Ingo Wiarda
* Email: ingo_wiarda@dewarim.de
* Website: https://github.com/dewarim/cinnamon.js

Parts of this software were created during free project time @ [Connexity.com](http://connexity.com) (2016-11-28 to 2016-11-02)
