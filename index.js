// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
require("dotenv").config();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

const getHtmlForMap = async () => {
    try {
        return await axios.get('https://apexlegendsstatus.com/current-map');
    } catch (error) {
        console.error(error);
    }
};

const getHtmlForMapList = async () => {
    try {
        return await axios.get('https://apexlegendsstatus.com/current-map/battle_royale/pubs');
    } catch (error) {
        console.error(error);
    }
};

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    // 현재 맵
    if (commandName === 'map') {
        try {
            const test = await getHtmlForMap()
                .then((html) => {
                    // axios 응답 스키마 `data`는 서버가 제공한 응답(데이터)을 받는다.
                    // load()는 인자로 html 문자열을 받아 cheerio 객체 반환
                    const $ = cheerio.load(html.data);
                    const map = {
                        mainContents: $('body > main > div > div:nth-child(3) > div:nth-child(1) > div.col-lg-8.olympus > div > h1:nth-child(1)').text(),
                    };
                    const time = {
                        mainContents: $('body > main > div > div:nth-child(3) > div:nth-child(1) > div.col-lg-8.olympus > div > h5:nth-child(4)').text(),
                    };
                    return { map, time };
                })
            console.log(test.time.mainContents.split(' ')[3])
            const hour = (parseInt(test.time.mainContents.split(' ')[3].split(':')[0]) + 9) % 24;
            const min = test.time.mainContents.split(' ')[3].split(':')[1];
            console.log(hour, min)
            await interaction.reply(`일겜 맵 : ${test.map.mainContents}\n종료시간 : ${hour}시 ${min}분`);
        }
        catch (err) {
            console.log(err)
        }
    }
    // 맵 세개까지
    else if (commandName === 'maplist') {
        try {
            const test = await getHtmlForMapList()
                .then((html) => {
                    // axios 응답 스키마 `data`는 서버가 제공한 응답(데이터)을 받는다.
                    // load()는 인자로 html 문자열을 받아 cheerio 객체 반환
                    const $ = cheerio.load(html.data);
                    const map = [];
                    const time = [];
                    for (let i = 3; i < 6; i++) {
                        map.push($(`body > main > div > div:nth-child(${i}) > h3`).text())
                        time.push($(`body > main > div > div:nth-child(${i}) > p`).text())
                    }
                    return { map, time };
                })
            let reply = '';
            for (let i = 0; i < 3; i++) {
                const hour = (parseInt(test.time[i].split(' ')[4].split(':')[0]) + 9) % 24;
                const min = test.time[i].split(' ')[4].split(':')[1];
                console.log(hour, min)
                reply += `맵 : ${test.map[i]}\t종료시간 : ${hour}시 ${min}분\n`
            }
            await interaction.reply(reply);
        }
        catch (err) {
            console.log(err)
        }
    } else if (commandName === 'user') {
        await interaction.reply('User info.');
    }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);