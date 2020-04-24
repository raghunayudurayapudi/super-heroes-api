const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

module.exports = app => {
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.urlencoded({ extended: false }));
  app.use(function (req, res, next) {
    res.setHeader('charset', 'utf-8')
    next();
  });
};
