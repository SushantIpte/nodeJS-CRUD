// import cluster from 'cluster';
// import { cpus } from 'os';
// import process from 'process';

let cluster = require('cluster');
let process = require('process');
let { cpus } = require('os')
let { startScript } = require('./app');

const numCPUs = cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    startScript(process);
    console.log(`Worker ${process.pid} started`);
}