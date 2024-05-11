// const puppeteer = require('puppeteer');
import puppeteer from 'puppeteer-core';














// !!! В Gemini был код, как захватить скачанный файл. Посмотреть



// Загрузка работает даже в фоновом режиме, без открытия окна браузера
// Нужно продумать, как лучше организовать работу с вкладками
// Наверное, через 1 секунду после последней строчки закрыть вкладку, и затем открыть новую


// Возможно код, для переименования загруженного файла:

/*
    page.on('download', async (download) => {
  console.log('Загрузка началась:', download.url());

  // Дождитесь завершения загрузки
  await download.on('end', () => {
    const filename = download.filename(); // Получить имя файла
    const newFilename = 'name file 1.mp4'; // Задать новое имя

    // Переименовать файл
    await fs.rename(filename, newFilename);
    console.log('Файл переименован:', newFilename);
  });
});
*/

















// Функция для ожидания
const delay = ms => new Promise(res => setTimeout(res, ms));
// Использование: 
// await delay(500);




DownloadVideoFromURL('https://vk.com/video-72495085_456242529')




async function DownloadVideoFromURL(inputURLVideo) {
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
    page.goto('https://www.downloadvideosfrom.com/ru/VK.php#GoogleBetweenAd', { waitUntil: 'load' });

    localMainCounter = 2; console.log(localMainCounter + ': Ждём 7 секунд, пока страница загрузится');
    
    await delay(7000);

    localMainCounter = 3; 
    console.log(localMainCounter + ': Передаём управление в функцию загрузки видео на уже открытой странице');

    // Передаём управление в функцию загрузки видео на уже открытой странице
    await downloadVideoFromOpenedWebSite(page, inputURLVideo);

    localMainCounter = 7; console.log(localMainCounter + ': Закрываем браузер');

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
























