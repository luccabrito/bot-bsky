"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@atproto/api");
const dotenv = require('dotenv');
const cron_1 = require("cron");
const axios = require('axios');
const process = require("process");
dotenv.config();
// Create a Bluesky Agent 
const agent = new api_1.BskyAgent({
    service: 'https://bsky.social',
});

async function fetchRandomLyric() {
    try {
      const response = await axios.get('https://spillout-production.up.railway.app/lyrics/random');
      const { lyric, track, artist } = response.data;
      console.log(`Just obtained the lyric of ${track}.`);
      return `${lyric}\n\n(${track} - ${artist})`;
    } catch (error) {
      console.error('Error in retrieving random lyric: ', error);
      return '';
    }
}

async function main() {

    await agent.login({ identifier: process.env.BLUESKY_USERNAME, password: process.env.BLUESKY_PASSWORD });
    const lyric = await fetchRandomLyric();
    if (lyric) {
        await agent.post({
          text: lyric,
        });
        console.log(`Just posted the retrieved lyrics.`);
    } else {
        console.log(`Couldn't post the retrieved lyrics.`);
    }
}

main();

const scheduleExpression = '0 */3 * * *';
const job = new cron_1.CronJob(scheduleExpression, main);
job.start();
