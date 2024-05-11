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

    const pagePromise = page.goto('https://www.downloadvideosfrom.com/ru/VK.php#GoogleBetweenAd',
      { waitUntil: 'load' });
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000));

    localMainCounter = 2; console.log(localMainCounter + ': Ждём 5 секунд, пока страница загрузится');

    const result = await Promise.race([pagePromise, timeoutPromise]);
    // await Promise.race([pagePromise, timeoutPromise]);

    if (result === pagePromise) {
      console.log('Страница загружена');
    } else {
      console.log('Время ожидания истекло');
    }

    localMainCounter = 3; console.log(localMainCounter + ': Идём дальше');

    setTimeout(() => {
      localMainCounter = 4;
      console.log(localMainCounter + ': Вставляем текстовую строку в поле ввода с id="url"');

      // page.evaluate(() => {
      //   // document.querySelector('#url').value = 'https://vk.com/video-72495085_456242529';
      //   document.querySelector('#url').value = inputURLVideo;
      // });

      page.evaluate((url) => {
        document.querySelector('#url').value = url;
      }, inputURLVideo);

      setTimeout(() => {
        localMainCounter = 5;
        console.log(localMainCounter + ': Инициируем нажатие на кнопку с id="DownloadMP4HD"');
        // Инициируем нажатие на кнопку с id="DownloadMP4HD"
        page.click('#DownloadMP4HD');
      }, 500);
    }, 5000);

  } catch (error) {
    console.error('Произошла Ошибка:', error);
  }
}





























