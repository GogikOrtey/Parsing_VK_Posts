// const puppeteer = require('puppeteer');
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import fsp from 'fs/promises';
import readline from 'readline';



console.log(" ")
console.log("———————————————————————————————————————————————————————————")
console.log("———————————————————————————————————————————————————————————")
console.log("v0.2")
console.log("")
console.log("Вас приветствует программа загрузки видео по ссылкам!")
console.log("")


// Функция для ожидания
const delay = ms => new Promise(res => setTimeout(res, ms));
// Использование: 
// await delay(500);



// Путь к папке "Загрузки"
const downloadsFolder = 'D:\\Загрузки';



let data = [];

data = await processFile(data);

await MainProcess();


// Функция, которая загружает в массив data все ссылки из входного текстового файла
async function processFile(data) {
  let fileStream = fs.createReadStream('video/input.txt');
  let rl = readline.createInterface({ input: fileStream });

  let temp = [];

  for await (let line of rl) {
    if (line.startsWith('[')) {
      if (temp.length > 0) {
        data.push(temp);
        temp = [];
      }
      temp.push(line);
    } else if (line.startsWith('https://')) {
      temp.push(line);
    } else if (line.trim() !== '') {
      temp.push(line);
    }
  }

  if (temp.length > 0) {
    data.push(temp);
  }

  if (data.length === 0) {
    console.log('🟠 Файлик пуст, и в нём нет ссылок');
  } else {
    console.log('🟢 Файлик успешно обработан и загружен');
    // console.log(data);
  }

  return data;
}


// Основная функция, которая загружает все видео по ссылкам, из массива data
async function MainProcess() {
  // Удаляем первый внутренний массив
  data.shift();

  // Цикл, который просто выводит информацию:
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let description = item[0].substring(1, item[0].indexOf(']'));
    console.log(`Дата и время: ${description}`);

    let rest = item[0].substring(item[0].indexOf(']') + 1).trim();
    if (rest.length > 0) {
      console.log(`Описание: ${rest}`);
    }

    for (let j = 1; j < item.length; j++) {
      console.log(`Ссылка ${j}: ${item[j]}`);
    }

    console.log(`Обработка ${i + 1} элемента завершена`);
    console.log()
  }


  // Цикл, который обрабатывает все видео
  for (let i = 0; i < data.length; i++) {

    let item = data[i];

    let description = item[0].substring(1, item[0].indexOf(']'));
    console.log(`Дата и время: ${description}`);

    let rest = item[0].substring(item[0].indexOf(']') + 1).trim();
    if (rest.length > 0) {
      console.log(`Описание: ${rest}`);
    }

    let allDescr = item[0];

    for (let j = 1; j < item.length; j++) {
      // console.log(`Ссылка ${j}: ${item[j]}`);

      await DownloadVideoFromURL(item[j], allDescr)
    }

    console.log(`Обработка ${i + 1} элемента завершена`);
    console.log()
  }
}












 



















// DownloadVideoFromURL('https://vk.com/video-72495085_456242529')



// Функция, которая открывает браузер, и дальше передаёт управление в другие функции
async function DownloadVideoFromURL(inputURLVideo, allDescr) {
  let localMainCounter = 0; // Счётчик, который показывает, какое у нас сейчас состояние в коде

  try {
    // console.log("inputURLVideo = " + inputURLVideo);

    localMainCounter = 0; console.log(localMainCounter + ': Открываем браузер');

    // Запускаем браузер:
    const browser = await puppeteer.launch({
      // Путь к исполняемому файлу браузера Edge
      executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      headless: false // Открывает браузер в режиме с графическим интерфейсом
    });

    localMainCounter = 1; console.log(localMainCounter + ': Браузер успешно открыт');

    const page = await browser.newPage();

    // Открываю нужную веб-страницу
    // page.goto('https://www.downloadvideosfrom.com/ru/VK.php#GoogleBetweenAd', { waitUntil: 'load' }); 

    // const result = await Promise.race([pagePromise, timeoutPromise]);
    
    // if (result === pagePromise) {
    //   console.log('Страница загружена');
    //   // Ваш код здесь...
    // } else {
    //   console.log('Время ожидания истекло');
    //   // Обработайте ошибку загрузки страницы
    // }

    const pagePromise = page.goto('https://www.downloadvideosfrom.com/ru/VK.php#GoogleBetweenAd', { waitUntil: 'load' });
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000));

    // const result = 
    await Promise.race([pagePromise, timeoutPromise]);

    // if (result === pagePromise) {
    //   console.log('Страница загружена');
    //   // Ваш код здесь...
    // } else {
    //   console.log('Время ожидания истекло');
    //   // Обработайте ошибку загрузки страницы
    // }

    localMainCounter = 2; console.log(localMainCounter + ': Ждём 7 секунд, пока страница загрузится');
    
    await delay(7000);

    localMainCounter = 3; 
    console.log(localMainCounter + ': Передаём управление в функцию загрузки видео на уже открытой странице');

    // Передаём управление в функцию загрузки видео на уже открытой странице
    await downloadVideoFromOpenedWebSite(page, inputURLVideo);

    localMainCounter = 7; 
    console.log(localMainCounter + ': Ждём, пока файл загрузится');
    console.log()

    let filePatch = await waitForDownloadVideo();

    localMainCounter = 8; console.log(localMainCounter + ': Файл загружен');

    console.log("——————————————————")

    localMainCounter = 9; console.log(localMainCounter + ': Закрываем браузер');

    // await browser.close();
  } catch (error) {
    console.error('Произошла Ошибка:', error);
  }
}



// Скачивает видео, уже с открытой страницы
async function downloadVideoFromOpenedWebSite(page, inputURLVideo) {
  console.log('Скачиваем видео с адресом: ' + inputURLVideo);
  await delay(500);

  let localMainCounter = 4;
  console.log(localMainCounter + ': Вставляем текстовую строку в поле ввода с id="url"');

  page.evaluate((url) => {
    document.querySelector('#url').value = url;
  }, inputURLVideo);

  await delay(500);
  localMainCounter = 5;
  console.log(localMainCounter + ': Инициируем нажатие на кнопку с id="DownloadMP4HD"');
  // Инициируем нажатие на кнопку с id="DownloadMP4HD"
  page.click('#DownloadMP4HD');

  await delay(500);
  localMainCounter = 6; console.log(localMainCounter + ': Мы успешно начали загрузку видео');
}









// waitForDownloadVideo();






// Ждёт, пока в папке Загрузки не появится скачанный файл
async function waitForDownloadVideo() {
  let finalPatch = ""

  while (finalPatch == "") {
    await delay(1000); // Ждём 1 секунду

    const files = await fsp.readdir(downloadsFolder);
    const mp4Files = files.filter(file => path.extname(file) === '.mp4');

    if (mp4Files.length === 1) {
      let finalPath = path.join(downloadsFolder, mp4Files[0])

      console.log();      
      console.log('Файл загрузился:');      
      console.log(finalPath);

      return finalPath;

    } else if (mp4Files.length > 1) {
      console.log('Найдено несколько файлов .mp4, удалите все лишние файлы.');

    } else {
      console.log("Файл ещё не загрузился, ждём...");
    }
  }
}



































