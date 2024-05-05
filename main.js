import fetch from 'node-fetch';
import fs from 'fs';
import https from 'https';
import moment from 'moment';
import crypto from 'crypto';
import sharp from 'sharp';
import axios from 'axios';



// Ключ доступа к API
const accessToken = '37382a8c37382a8c37382a8ca9342001943373837382a8c5108cd6d715313038c2969d4';

console.log(" ")
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

    // Вывести приветственное сообщение
    // Вывести название группы
    // Вывести количество постов, которое мы запрашиваем
    // Вывести offset
    // Вывести количество поста, на котором мы остановились

let bool_isHttpGerResponse = false; // Нужен для отображения подсказки о времени http ответа
let bool_isinfoShow = false;        // Если = true, то в консоль будут выводится дополнительные информационные сообщения

// Получаем последние посты из группы
// Здесь, "count=" - это количество постов, которые вернёт нам сервер max=100
// "offset=_" - это сдвиг, относительно которого нам сервер отправит посты

let count = 5
let offset = 0

fetch(`https://api.vk.com/method/wall.get?
owner_id=-${groupId}&
count=${count}&
offset=${offset}&
access_token=${accessToken}&
v=5.130`)
    .then(res => res.json())
    .then(json => {

        // Информация о количестве запрашиваемых постов:
        let int_insCountOfThePost = 0;
        console.log("count = " + count)
        console.log("offset = " + offset)
        console.log("")

        // Обрабатываем каждый пост
        json.response.items.forEach(item => {
            int_insCountOfThePost++;    // № обрабатываемого поста, начиная с 1

            // Выводим всю информацию о посте
            //console.log("📚 Информация о посте: ", item);

            // Получаем дату публикации поста
            const postDateTime = moment.unix(item.date).format('YYYY.MM.DD HH⁚mm');

            /*////////////////////////////////////
            //      Обработка фото в посте      //
            ////////////////////////////////////*/


            // Проверяем, есть ли в посте фотографии или пересланные посты
            let attachments = 'attachments' in item ? item.attachments : [];


            if ('copy_history' in item && item.copy_history.length > 0) {
                if ('attachments' in item.copy_history[0]) {
                    // Если пересланные посты есть, то мы совмещаем их историю, позволяя нашей программе 
                    // обработать фотографии и из этих вложенных постов
                    attachments = attachments.concat(item.copy_history[0].attachments);
                }
            }

            const photos = attachments.filter(attachment => attachment.type === 'photo');

            let bool_ismultiplyPhotosInThePost = false; // = true, если в посте > 1 фотографии
            let countImage = 1;

            if (photos.length > 1) {
                console.log("📚 В посте несколько фотографий");
                bool_ismultiplyPhotosInThePost = true;
            }


            /*////////////////////////////////////
            //     Обработка текста в посте     //
            ////////////////////////////////////*/


            // Проверяем, есть ли в посте текст
            let postText = 'text' in item ? item.text : '';

            if ('copy_history' in item && item.copy_history.length > 0) {
                if ('text' in item.copy_history[0]) {

                    // Совмещаем текстовые описания поста и вложенного поста
                    if (postText != '' && (item.copy_history[0].text != '')) {
                        postText += '\n——————————————————————\n' + item.copy_history[0].text;
                    } else if (postText == '' && (item.copy_history[0].text != '')) {
                        postText += item.copy_history[0].text;
                    }
                }
            }

            if (postText != '') {
                let fileName = '[' + postDateTime + ']';
                let path = `img/${fileName}.txt`;

                // Сохраняю этот текст в папке img
                fs.writeFile(path, postText, err => {
                    if (err) throw err;
                    console.log("📄 Текстовый файл с именем " + fileName + " сохранён в папке img");

                    // Получаю timestamp из postDateTime
                    let timestamp = moment(postDateTime, 'YYYY.MM.DD HH⁚mm').valueOf();

                    // Устанавливаю время создания файла
                    fs.utimes(path, timestamp / 1000, timestamp / 1000, (err) => {
                        if (err) throw err;
                        if (bool_isinfoShow) console.log("⏰ Время создания файла " + fileName +
                            " установлено на " + postDateTime);
                    });
                });
            }

            /*////////////////////////////////////
            //              Другое              //
            ////////////////////////////////////*/

            // Обрабатываем каждое вложение, и выводим его тип контента                                   
            attachments.forEach(attachment => {
                // Выводим тип контента
                console.log(`Пост №${int_insCountOfThePost} Тип контента: `, attachment.type);
            });
            console.log("") 



            // Добавить обработку видео
                // Проверить, что он работает и с видео и с клипами
            // Добавить обработку gif

            // Добавить обработку опросов



            /*////////////////////////////////////////////////////////
            //                   Сохранение фото                    //
            /////////////////////////////////////////////////////// */

            // Для всех изображений, в полученном наборе:
            photos.forEach(photoAttachment => {
                // Выводим всю информацию о фотографии
                //console.log("📚 Информация о фотографии: ", photoAttachment.photo);

                // Получаем URL фотографии с максимальным разрешением
                const photo = photoAttachment.photo;
                const photoUrl = photo.sizes[photo.sizes.length - 1].url;

                // Запрашиваю картинки, по ссылкам, полученным из поста
                // Эти запросы выполняются асинхронно
                https.get(photoUrl, response => {
                    // В среднем - 2.2 секунды на этот запрос
                    if(bool_isHttpGerResponse == false) {
                        bool_isHttpGerResponse = true;
                        // Вывожу это, что бы помнить о том, что https.get является асинхронным запросом
                        //console.log(" ")
                        console.log(" ")
                        console.log("🕓")
                    }

                    let data = [];

                    response.on('data', chunk => {
                        data.push(chunk);
                    }).on('end', () => {
                        let buffer = Buffer.concat(data);           // Собираем кусочки изображения в одно

                        //let hash = createHash(buffer);            // Вычисляем хеш изображения
                        //console.log("hash = " + hash)

                        let fileName = '[' + postDateTime + ']';  // Задаю имя для изображения
                        if (bool_ismultiplyPhotosInThePost === true) {
                            // Если изображений несколько, то для каждого задаю его номер в посте
                            fileName += " - " + countImage;
                            countImage++;
                        }
                        //fileName += createFileName(hash) + ".jpg";// Имя с хешем изображения
                        fileName += ".jpg";                         // Имя без хеша изображения

                        let path = `img/${fileName}`;               // Путь, куда картинка будет сохранена

                        // Кидаю предупреждение, если такой файл уже есть в этой папке
                        if (fs.existsSync(path)) {
                            console.log("⚠️ Файл с именем " + fileName + " уже существует в папке img, и будет заменён");
                        }

                        // Сохраняю это изображение в папке img
                        fs.writeFile(path, buffer, err => {
                            if (err) throw err;
                            console.log("✅ Файл с именем " + fileName + " сохранён в папке img");

                            // Получаю timestamp из postDateTime
                            let timestamp = moment(postDateTime, 'YYYY.MM.DD HH⁚mm').valueOf();

                            // Устанавливаю время создания файла
                            fs.utimes(path, timestamp / 1000, timestamp / 1000, (err) => {
                                if (err) throw err;
                                if(bool_isinfoShow) console.log("⏰ Время создания файла " + fileName + 
                                    " установлено на " + postDateTime);
                            });
                        });
                    });
                });
            });

            /*/////////////////////////////////////////////////////////
            //                   Сохранение видео                    //
            //////////////////////////////////////////////////////// */

            // Получаем все видео вложения
            const videos = attachments.filter(attachment => attachment.type === 'video');

            // Для всех видео вложений, в полученном наборе:
            videos.forEach(videoAttachment => {
                // Получаем URL видео

                const videoInfo = json.response.items[0];
                const video = videoAttachment.video;

                //fuGetVideo(video, videoInfo);

                // Создаем URL страницы ВКонтакте с видео
                const videoPageUrl = `https://vk.com/video${video.owner_id}_${video.id}`;

                console.log(videoPageUrl); // URL страницы ВКонтакте с видео

                //fGetVideo2(videoPageUrl, int_insCountOfThePost).then(() => console.log('Видео успешно скачано!'));

                let vid2 = '' + video.owner_id + '_' + video.id;

                getVideoLink(vid2).then(console.log).catch(console.error);


                // let maxResolution = 0;
                // let videoUrl = '';

                // console.log(videos)

                // for (let resolution in video.files) {
                //     let currentResolution = parseInt(resolution.replace('mp4_', ''));
                //     if (currentResolution > maxResolution) {
                //         maxResolution = currentResolution;
                //         videoUrl = video.files[resolution];
                //     }
                // }

                // console.log(videoUrl); // URL видео с наибольшим разрешением

                // // Запрашиваем видео по ссылке, полученной из поста
                // https.get(videoUrl, response => {
                //     let data = [];

                //     response.on('data', chunk => {
                //         data.push(chunk);
                //     }).on('end', () => {
                //         let buffer = Buffer.concat(data); // Собираем кусочки видео в одно

                //         let fileName = '[' + postDateTime + ']'; // Задаём имя для видео
                //         fileName += ".mp4"; // Имя видео файла

                //         let path = `videos/${fileName}`; // Путь, куда видео будет сохранено

                //         // Кидаем предупреждение, если такой файл уже есть в этой папке
                //         if (fs.existsSync(path)) {
                //             console.log("⚠️ Файл с именем " + fileName + " уже существует в папке videos, и будет заменён");
                //         }

                //         // Сохраняем это видео в папке videos
                //         fs.writeFile(path, buffer, err => {
                //             if (err) throw err;
                //             console.log("🎦 Видео с именем " + fileName + " сохранён в папке videos");

                //             // Получаем timestamp из postDateTime
                //             let timestamp = moment(postDateTime, 'YYYY.MM.DD HH⁚mm').valueOf();

                //             // Устанавливаем время создания файла
                //             fs.utimes(path, timestamp / 1000, timestamp / 1000, (err) => {
                //                 if (err) throw err;
                //                 console.log("⏰ Время создания файла " + fileName +
                //                     " установлено на " + postDateTime);
                //             });
                //         });
                //     });
                // });
            });
        });
    });







// Потом:
// • В конце добавить вывод, какой это пост по номеру, с самого верха
// • В начале вывести количество всех постов в группе
// • Сделать автозагрузку постов, например по 20 штук


// Выводит в консоль URL страницы ВКонтакте с этим видео
function fGetVideo(video, videoInfo) {
fetch(`https://api.vk.com/method/video.get?
owner_id=${video.owner_id}&
videos=${video.owner_id}_${video.id}&
access_token=${accessToken}&
v=5.130`)

    .then(res => res.json())
    .then(json => {
        //const videoInfo = json.response.items[0];
        console.log(videoInfo.player); // URL страницы ВКонтакте с видео
    });
}

// Пытаестя скачать видео, по прямой сслыке
async function fGetVideo2(videoURL, nameFile) {
    // let url = 'https://vk.com/video-179997490_456242052'; // URL видео
    let response = await axios.get(videoURL, {responseType: 'stream'});
    let writer = fs.createWriteStream('video/video ' + nameFile + '.mp4');

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function getVideoLink(videoId) {
    //const videoId = '-179997490_456242052'; // ID видео
    console.log("Скачиваем видео: " + videoId)

    const response = await axios.get(
`https://api.vk.com/method/video.get?
videos=${videoId}&
access_token=${accessToken}&
v=5.130`);

    if (response.data.response && response.data.response.items && response.data.response.items.length > 0) {
        const video = response.data.response.items[0];
        return video.player; // Ссылка на видео
    } else {
        throw new Error('Видео не найдено');
    }
}









