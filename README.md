# Simple File Server

## Installation

### Clone this project from git

```sh
$ git clone https://github.com/ipanyap/simple-file-server.git
```

### Required Tools

Make sure you have [npm](https://www.npmjs.org/) installed globally.

```sh
$ sudo apt-get install npm
```

### Setup configuration

* Create file (project-directory)/config/config.json based on (project-directory)/config/config.json.example
* Fill in the necessary configuration

### Install dependencies

In the project root directory run the following command to install the dependencies:

```sh
$ npm install
```

## How to Run

In the project root directory run the following command to run the server:

```sh
$ node app.js
```
Or if you want to use [nodemon](https://github.com/remy/nodemon)
```sh
$ npm install -g nodemon
$ nodemon app.js
```
Server will run on http://localhost:8000/. The port can be changed by setting PORT environment variable.


