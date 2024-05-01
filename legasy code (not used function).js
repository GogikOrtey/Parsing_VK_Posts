import fetch from 'node-fetch';
import fs from 'fs';
import https from 'https';
import moment from 'moment';
import crypto from 'crypto';
import sharp from 'sharp';


// Возвращает случайное имя для файла, состоящее из строчных и прописных символов английского алфавита
function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Ключ доступа к API
const accessToken = '37382a8c37382a8c37382a8ca9342001943373837382a8c5108cd6d715313038c2969d4';

console.log("———————————————————————————————————————————————————————————")
console.log("v0.1")

// ----------------------------------
// Проверка, работает ли мой API-ключ

// // ID пользователя ВКонтакте
// //const userId = '1';
// const userId = 'gog.ortey';

// fetch(`https://api.vk.com/method/users.get?user_ids=${userId}&access_token=${accessToken}&v=5.130`)
//     .then(res => res.json()) 
//     .then(json => console.log(json));


// ID группы ВКонтакте
const groupId = '224924750';

// Генерируем случайное имя файла
//const randomFileName = crypto.randomBytes(10).toString('hex') + '.jpg';
//const randomFileName = generateRandomString(10) + '.jpg';

// Функция для создания хеша изображения
function createHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Функция для создания имени файла из хеша
function createFileName(hash) {
    return hash.slice(0, 10);
}

// Сжимает входящее изображение так, что макисмальная стороа составляет не больше 128 пикселей
// async function resizeImage(data) {
//     const MAX_SIZE = 128;
//     const image = sharp(data);

//     // Получаем метаданные изображения
//     const metadata = await image.metadata();

//     // Вычисляем новые размеры, сохраняя пропорции
//     const width = metadata.width > metadata.height ? MAX_SIZE : Math.round(MAX_SIZE * metadata.width / metadata.height);
//     const height = metadata.height > metadata.width ? MAX_SIZE : Math.round(MAX_SIZE * metadata.height / metadata.width);

//     // Изменяем размер изображения
//     const output = await image.resize(width, height).toBuffer();

//     return output;
// }


async function resizeImage(data) {
    const MAX_SIZE = 128;

    // Изменяем размер изображения сразу при создании экземпляра Sharp
    const output = await sharp(data)
        .resize({ width: MAX_SIZE, height: MAX_SIZE, fit: 'inside' })
        .toBuffer();

    return output;
}

















