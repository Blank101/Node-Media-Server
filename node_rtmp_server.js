//
//  Created by Mingliang Chen on 17/8/1.
//  illuspas[a]gmail.com
//  Copyright (c) 2017 Nodemedia. All rights reserved.
//
const Net = require('net');
const NodeRtmpSession = require('./node_rtmp_session');
const NodeCoreUtils = require('./node_core_utils');

const context = require('./node_core_ctx');

const RTMP_PORT = 1935;

class NodeRtmpServer {
  constructor(config) {
    config.rtmp.port = this.port = config.rtmp.port ? config.rtmp.port : RTMP_PORT;
    this.tcpServer = Net.createServer((socket) => {
      let session = new NodeRtmpSession(config, socket);
      session.run();
    })
  }

  run() {
    this.tcpServer.listen(this.port, () => {
      console.log(`Node Media Rtmp Server started on port: ${this.port}`);
    });

    this.tcpServer.on('error', (e) => {
      console.error(`Node Media Rtmp Server ${e}`);
    });

    this.tcpServer.on('close', () => {
      console.log('Node Media Rtmp Server Close.');
    });
  }

  stop() {
    this.tcpServer.close();
    context.sessions.forEach((session, id) => {
      if (session instanceof NodeRtmpSession) {
        session.socket.destroy();
        context.sessions.delete(id);
      }
    });
  }
}

module.exports = NodeRtmpServer
