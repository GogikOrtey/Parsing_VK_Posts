import fetch from 'node-fetch';
import fs from 'fs';
import https from 'https';
import moment from 'moment';
import crypto from 'crypto';
import sharp from 'sharp';
import axios from 'axios';

// Эта программа скачает и сохранит: Картинки, Подписи к посту и GIF
// Также, она получит ссылки на все видео из постов, и сохранит их в текстовый файл, с датами постов


// Ключ доступа к API
const accessToken = '37382a8c37382a8c37382a8ca9342001943373837382a8c5108cd6d715313038c2969d4';

console.log(" ")
console.log("———————————————————————————————————————————————————————————")
console.log("v0.3")
console.log("")
console.log("Вас приветствует программа загрузки контента из ВК!")
console.log("")


if(accessToken == '') {
    console.log("В программе не указан Ключ доступа к API. Его нужно указать в переменной accessToken, в ~14 строчке кода")
    console.log("Как получить Ключ доступа к API ВКонтакте - вы можете легко узнать в интернете. Это не займёт больше 2х минут")
    console.log('');
    console.log('🔴 Error! Программа остановлена с ошибкой');
    process.exit();
}


// ID группы ВКонтакте
const groupId = '224924750';

let goonGroupName = '';


// Получаю и вывожу название группы:
await fetch(`https://api.vk.com/method/groups.getById?group_id=${groupId}&access_token=${accessToken}&v=5.130`)
    .then(response => response.json())
    .then(data => {
        let groupName = data.response[0].name;
        goonGroupName = sanitizeFilename(groupName);
        console.log("Название группы: " + goonGroupName);
        console.log("");
    })


// Функция, которая удаляет из полученной строки все недопустимые символы для именования файла
function sanitizeFilename(filename) {
    // Список недопустимых символов
    const invalidChars = /[~!@#$%^&*()+=\[\]{};':"\\|<>\/?]+/g;
    filename = filename.replace(/\n/g, " ");

    // // Удаление всех пробелов
    // filename = filename.replace(/\s/g, '-');

    // Удаление всех недопустимых символов
    return filename.replace(invalidChars, '');
}

// Та-же функция, только для именования файлов
function sanitizeFilename2(filename) {
    // Быстрые замены неликвидных символов. Что бы сохранить контекст, и попасть в рамки
    filename = filename.replace(/:/g, "⁚");
    filename = filename.replace(/\?/g, "‽");
    filename = filename.replace(/\n/g, " ");

    // Список недопустимых символов
    const invalidChars = /[~!@#$%^&*()+=\[\]{};':"\\|<>\/?]+/g;

    // Удаление всех недопустимых символов
    return filename.replace(invalidChars, '');
}




// Путь по умлочанию, где создаются папки Session
// (Относительно исполняемого файла)

let mainPath = 'main/';



// Создаю папку Session [Дата и время] - для устранения любых конфликтов
// В ней создаю папку с названием группы

let currDateTime = moment().format('YYYY.MM.DD HH⁚mm⁚ss');
let nameFlMainSession = mainPath + 'Session [' + currDateTime + ']';
 
// Проверяю, существуют ли такая папка
if (fs.existsSync(nameFlMainSession)) {
    // Если да - то останавливаю программу
    console.log('');
    console.log('🔴 Error! Программа остановлена с ошибкой:');
    console.log('Папка с таким названием сессии уже существует!');
    console.log('Подождите 1 минуту, и запустите программу снова');
    process.exit();
}

// Создаём папку новой сессии
await fs.mkdirSync(nameFlMainSession, { recursive: true });
console.log('Папка новой сессии была успешно создана');

let floberGroupName = nameFlMainSession + '/' + goonGroupName; // Папка с названием группы

// Создаём в ней папку с именем назавния группы, из которой сохраняем контент
await fs.mkdirSync(floberGroupName, { recursive: true });




// Создаю .txt файл, для сохранения ссылок на видео
// (для того, что бы загрузить их позже)

// Заголовок текстового файла:
let data = 'Все ссылки на видео из постов\n\nГруппа: ' + goonGroupName + '\n\n'; 
// Путь к этому текстовому файлу:
let txtFile_allVideoLinks = nameFlMainSession + '/Ссылки на видео из группы ' + goonGroupName + '.txt';

await fs.writeFileSync(txtFile_allVideoLinks, data);


// // Добавление строк в этот текстовый файл:
// let dataAdd = "123"

// await fs.appendFileSync(txtFile_allVideoLinks, dataAdd, (err) => {
//     if (err) throw err;
// });





let bool_isHttpGerResponse = false; // Нужен для отображения подсказки о времени http ответа
let bool_isinfoShow = false;        // Если = true, то в консоль будут выводится дополнительные информационные сообщения

// Получаем последние посты из группы
// Здесь, "count=" - это количество постов, которые вернёт нам сервер max=100
// "offset=_" - это сдвиг, относительно которого нам сервер отправит посты

let count = 10
let offset = 30

let bool_isShowCountOfPosts = false; // Мы уже вывели общее количество постов?

console.log(`Мы начинаем с ${offset} поста сверху страницы, и запрашиваем ${count} постов`)

await 
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
        //console.log("")

        // Обрабатываем каждый пост
        json.response.items.forEach(item => {
            console.log("") 
            int_insCountOfThePost++;    // № обрабатываемого поста, начиная с 1

            // Выводим всю информацию о посте
            //console.log("📚 Информация о посте: ", item);

            // Выводим общее количество постов в группе:
            if(bool_isShowCountOfPosts == false) {
                if (offset == 0) {
                    // Ищем id поста:
                    let idPost = 'id' in item ? item.id : '';
                    console.log("Общее количество постов в группе: " + idPost)
                    console.log("") 
                    bool_isShowCountOfPosts = true;
                } else {
                    bool_isShowCountOfPosts = true;
                }
            }

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

            // !!! Сделать добавление 120 символов текста поста к картинке
            // Если не помещается - текст образается, вставляется троеточие, и полный текст сохраняется в .txt файл

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

            let goodPostText = sanitizeFilename2(postText)

            if (goodPostText.length > 120) {
                // Обрезаю строку до 120 символов, если она слишком длинная
                goodPostText = goodPostText.substring(0, 120);
                goodPostText += "..."

                CreateTextFileForDescrPost();
            } else {
                // Проверяю, не удалились ли случайно лишние символы из описани
                // Если удалились - всё равно создаю текстовый документ с описанием поста. На всякий случай

                if(goodPostText != postText) {
                    if (bool_isinfoShow) console.log("! Отфильтрованный текст неверный, сохраняю копию в текстовом документе")
                    if (bool_isinfoShow) console.log("")
                    if (bool_isinfoShow) console.log("goodPostText = " + goodPostText)
                    if (bool_isinfoShow) console.log("postText = " + postText)
                    if (bool_isinfoShow) console.log("")
                    CreateTextFileForDescrPost();
                }
            }

            // Cоздаю текстовый документ с описанием поста
            function CreateTextFileForDescrPost() {
                if (postText != '') {
                
                    let fileName = '[' + postDateTime + ']';
                    let path = floberGroupName + `/${fileName}.txt`;
    
                    // Сохраняю этот текст в папке
                    fs.writeFile(path, postText, err => {
                        if (err) throw err;
                        console.log("📄 Текстовый файл с именем " + fileName + " сохранён в папке " + floberGroupName);
    
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
            }



            /*////////////////////////////////////
            //              Другое              //
            ////////////////////////////////////*/

            
            // Обрабатываем каждое вложение, и выводим его тип контента                                   
            attachments.forEach(attachment => {
                // Выводим тип контента
                let occ = '⚠️🟪'
                if(attachment.type == "photo") occ = '📸';
                if(attachment.type == "video") occ = '📽️';
                let globalCountPost = offset + int_insCountOfThePost;
                // console.log(`${occ} Пост №${int_insCountOfThePost} Тип контента:`, attachment.type); 
                console.log(`${occ} Пост №${globalCountPost} Тип контента:`, attachment.type);
            });   


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
                        let buffer = Buffer.concat(data);                   // Собираем кусочки изображения в одно

                        //let hash = createHash(buffer);                    // Вычисляем хеш изображения
                        //console.log("hash = " + hash)

                        let fileName = '[' + postDateTime + ']';            // Задаю имя для изображения

                        // Если в посте было описание, то я добавляю его в название файла
                        if(goodPostText != '') {
                            fileName += ' ' + goodPostText;
                        }

                        if (bool_ismultiplyPhotosInThePost === true) {
                            // Если изображений несколько, то для каждого задаю его номер в посте
                            fileName += " - " + countImage;
                            countImage++;
                        }

                        fileName += ".jpg"; 

                        let path = floberGroupName + `/${fileName}`;        // Путь, куда картинка будет сохранена

                        // Кидаю предупреждение, если такой файл уже есть в этой папке
                        if (fs.existsSync(path)) {
                            console.log("⚠️ Файл с именем " + fileName + " уже существует в папке " + floberGroupName + ", и будет заменён");
                        }

                        // Сохраняю это изображение в папке 
                        fs.writeFile(path, buffer, err => {
                            if (err) throw err;
                            console.log("✅ Файл с именем " + fileName + " сохранён в папке " + floberGroupName);

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

            if(videos != '') {
                if(goodPostText != '') {
                    // Если в посте есть текст, добавляем его в название к видео, после даты:
                    fs.appendFileSync(txtFile_allVideoLinks, '\n[' + postDateTime + '] ' + goodPostText + '\n');
                } else {                
                    fs.appendFileSync(txtFile_allVideoLinks, '\n[' + postDateTime + ']\n');
                }
            }

            // Для всех видео вложений, в полученном наборе:
            videos.forEach(videoAttachment => {
                // Получаем URL видео
                const video = videoAttachment.video;

                // Собираем URL страницы ВКонтакте с видео
                const videoPageUrl = `https://vk.com/video${video.owner_id}_${video.id}`;

                console.log(videoPageUrl); // URL страницы ВКонтакте с видео

                // Добавляем строку с этим URL в .txt файл
                // А также дату и время поста

                let nameStr = videoPageUrl + '\n'

                fs.appendFileSync(txtFile_allVideoLinks, nameStr);

            });
        });
    });



console.log(``)
console.log(`🟢🟢🟢 Программа успешно завершилась`)
let dOut2 = `Мы остановились на ` + (offset + count) + " посте";
console.log(dOut2)
console.log(``)

// Сохраняю в текстовом файле сессии, на каком посте мы остановились:

// Путь к этому текстовому файлу:
let txtFile_stopThisProgramm = nameFlMainSession + '/На каком посте остановились из группы ' + goonGroupName + '.txt';

await fs.writeFileSync(txtFile_stopThisProgramm, dOut2);


// !!! Здесь также вывести в файл, скачали ли мы все посты из группы, или нет
// Или если мы например дошли до опроса

// Добавить проверку в цикле на то, закончились ли посты в группе
// А также, дошли ли мы до опроса






// Потом:
// • Сделать автозагрузку постов, например по 20 штук
// • Пройтись по всем загруженным фотографиям, и удалить дубликаты (используя хеш файла)










