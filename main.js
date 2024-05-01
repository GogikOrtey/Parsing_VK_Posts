import fetch from 'node-fetch';
import fs from 'fs';
import https from 'https';
import moment from 'moment';
import crypto from 'crypto';
import sharp from 'sharp';



// Ключ доступа к API
const accessToken = '37382a8c37382a8c37382a8ca9342001943373837382a8c5108cd6d715313038c2969d4';

console.log("———————————————————————————————————————————————————————————")
console.log("v0.1")


// ID группы ВКонтакте
const groupId = '224924750';


// Функция для создания хеша изображения
function createHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Функция для создания имени файла из хеша
function createFileName(hash) {
    return hash.slice(0, 10);
}


// Получаем последний пост из группы
fetch(`https://api.vk.com/method/wall.get?owner_id=-${groupId}&count=1&access_token=${accessToken}&v=5.130`)
    .then(res => res.json())
    .then(json => {
        // Проверяем, есть ли в посте фотографии
        if ('attachments' in json.response.items[0] && json.response.items[0].attachments[0].type === 'photo') {
            // Получаем URL фотографии с максимальным разрешением
            const photo = json.response.items[0].attachments[0].photo;
            const photoUrl = photo.sizes[photo.sizes.length - 1].url;

            // Получаем дату публикации поста
            const postDate = moment.unix(json.response.items[0].date).format('DD.MM.YYYY');

            // В среднем - 2.2 секунды на этот запрос
            https.get(photoUrl, response => {
                let data = [];

                response.on('data', chunk => {
                    data.push(chunk);
                }).on('end', () => {
                    let buffer = Buffer.concat(data);       // Собираем кусочки изображения в одно
                    
                    let hash = createHash(buffer);          // Вычисляем хеш изображения
                    console.log("hash = " + hash)

                    let fileName = createFileName(hash);    // Задаю имя для изображения
                    fileName += ' [' + postDate + '].jpg';

                    let path = `img/${fileName}`;           // Путь, куда картинка будет сохранена

                    // Кидаю предупреждение, если такой файл уже есть в этой папке
                    if (fs.existsSync(path)) {
                        console.log("⚠️ Файл с именем " + fileName + " уже существует в папке img, и будет заменён");
                    }                    

                    // Сохраняю это изображение в папке img
                    fs.writeFile(path, buffer, err => {
                        if (err) throw err;
                        console.log("✅ Файл с именем " + fileName + " сохранён в папке img");
                    });
                });                
            });
        }
    });






















