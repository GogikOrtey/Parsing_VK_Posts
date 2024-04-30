// console.log("Hello world! 123")

// const fetch = require('node-fetch');
// const fs = require('fs');
// const https = require('https');

import fetch from 'node-fetch';
import fs from 'fs';
import https from 'https';

// Ваш ключ доступа к API
// const accessToken = 'lG8PnqJx9ZD0kHLJEho6';
const accessToken = '37382a8c37382a8c37382a8ca9342001943373837382a8c5108cd6d715313038c2969d4';

// ID группы ВКонтакте
const groupId = '224924750';

console.log(1234)

// ——————————————————————
// Проверка, работает ли мой API-ключ

// ID пользователя ВКонтакте
// const userId = '1';
const userId = 'gog.ortey';

fetch(`https://api.vk.com/method/users.get?user_ids=${userId}&access_token=${accessToken}&v=5.130`)
    .then(res => res.json())
    .then(json => console.log(json));








// // Получаем последний пост из группы
// fetch(`https://api.vk.com/method/wall.get?owner_id=-${groupId}&count=1&access_token=${accessToken}&v=5.130`)
//     .then(res => res.json())
//     .then(json => {
//         // Проверяем, есть ли в посте фотографии
//         if ('attachments' in json.response.items[0] && json.response.items[0].attachments[0].type === 'photo') {
//             // Получаем URL фотографии с максимальным разрешением
//             const photo = json.response.items[0].attachments[0].photo;
//             const photoUrl = photo.sizes[photo.sizes.length - 1].url;

//             // Скачиваем фотографию
//             const file = fs.createWriteStream('img/photo.jpg');
//             https.get(photoUrl, response => {
//                 response.pipe(file);
//             });
//         }
//  });

