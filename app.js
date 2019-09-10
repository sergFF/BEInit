const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const log = require('./utils/logger');

// Main application
const app = express();

// Enable compression
app.use(compression());

// enable cors for *
app.use(cors({ methods: 'GET, POST, PUT, DELETE' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
log.setLogLevel('debug');
app.use(morgan(':method :url :status :response-time ms - :res[content-length]', { stream: log }));

const jobsStore = {
  job1: {
    id: 1,
    jobName: 'test jobName',
    params: {},
    jobExecutionId: 'job1',
    status: 'queued'
  }
};

/**
 * random time from 1 sec to 10 min
 */
function getRandomTime(min = 1000, max = 1200) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

/**
 * changing running to finished or failed
 */
function runningToFinished(jobExecutionId) {
  const interval = getRandomTime();

  setTimeout(() => {
    if (!jobsStore[jobExecutionId]) return;
    jobsStore[jobExecutionId].status = (Math.round(Math.random()) ? 'failed' : 'finished');
  }, interval);
}

/**
 * changing queued status to running
 */
function queuedToRunning(jobExecutionId) {
  const interval = getRandomTime();
  setTimeout(() => {
    if (!jobsStore[jobExecutionId]) return;
    jobsStore[jobExecutionId].status = 'running';
    runningToFinished(jobExecutionId);
  }, interval);
}


app.get('/test', (req, res, next) => {
  const jobExecutionId = req.params.id;
  const job = jobsStore[jobExecutionId];

  if (!job) {
    const err = new Error(`Job: ${jobExecutionId} not found`);
    err.status = 400;
    return next(err);
  }

  return res.status(200)
    .json({ data: { status: job.status }, error: null });
});


// not found route
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

/**
 * ERRORS handle
 * WARNING! Do not remove next from parameters!!!
 */
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) =>
  res.status(err.status || 500)
    .json({
      error: {
        message: err.message,
        details: err.stack
      }
    })
);
/* eslint-enable no-unused-vars */

module.exports = app;
