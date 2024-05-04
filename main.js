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


// Получаем последние посты из группы
// Здесь, "count=" - это количество постов, которые вернёт нам сервер

fetch(`https://api.vk.com/method/wall.get?owner_id=-${groupId}&count=2&access_token=${accessToken}&v=5.130`)
    .then(res => res.json())
    .then(json => {

        // Обрабатываем каждый пост
        json.response.items.forEach(item => {

            // Выводим всю информацию о посте
            console.log("📚 Информация о посте: ", item);

            // Проверяем, есть ли в посте фотографии
            if ('attachments' in item) {
                const attachments = item.attachments;
                const photos = attachments.filter(attachment => attachment.type === 'photo');

                let bool_ismultiplyPhotosInThePost = false; // = true, если в посте > 1 фотографии
                let countImage = 1;

                // !!! Проверка на то, есть ли в посте текст
                // !!! Проверка на то, какой тип контента есть в посте (фото, видео, и т.д.)

                if (photos.length > 1) {
                    console.log("📚 В посте несколько фотографий");
                    bool_ismultiplyPhotosInThePost = true;
                }

                console.log(" ")

                // Для всех изображений, в полученном наборе:
                photos.forEach(photoAttachment => {
                    // Выводим всю информацию о фотографии
                    //console.log("📚 Информация о фотографии: ", photoAttachment.photo);

                    // Получаем URL фотографии с максимальным разрешением
                    const photo = photoAttachment.photo;
                    const photoUrl = photo.sizes[photo.sizes.length - 1].url;

                    // Получаем дату публикации поста
                    //const postDate = moment.unix(item.date).format('DD.MM.YYYY');
                    const postDateTime = moment.unix(item.date).format('DD.MM.YYYY HH⁚mm');
                    // const postDateTime = moment.unix(item.date).format('DD.MM.YYYY HH⁝mm');


                    // В среднем - 2.2 секунды на этот запрос
                    https.get(photoUrl, response => {
                        let data = [];

                        response.on('data', chunk => {
                            data.push(chunk);
                        }).on('end', () => {
                            let buffer = Buffer.concat(data);       // Собираем кусочки изображения в одно

                            let hash = createHash(buffer);          // Вычисляем хеш изображения
                            //console.log("hash = " + hash)

                            let fileName = ' [' + postDateTime + '] ';  // Задаю имя для изображения
                            if (bool_ismultiplyPhotosInThePost === true) {
                                // Если изображений несколько, то для каждого задаю его номер в посте
                                fileName += "- " + countImage + " ";
                                countImage++;
                            }
                            fileName += createFileName(hash) + ".jpg";


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
                });
            }
        });
    });
























