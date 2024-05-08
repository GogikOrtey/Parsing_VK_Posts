// const puppeteer = require('puppeteer');
import puppeteer from 'puppeteer-core';








// const browser = await puppeteer.launch({
//     executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', // замените на путь к вашему Edge
//     headless: false // открывает браузер в режиме с графическим интерфейсом
// });
// console.log('Браузер успешно открыт');
// // Закрываем браузер после 5 секунд

// const page = browser.newPage();
// page.goto('https://www.downloadvideosfrom.com/ru/VK.php#GoogleBetweenAd');

// setTimeout(() => {
//     console.log('вставляем текстовую строку в поле ввода с id="url"');
//     // вставляем текстовую строку в поле ввода с id="url"
//     page.evaluate(() => {
//         document.querySelector('#url').value = 'https://vk.com/video-72495085_456242529';
//     });
// }, 5000);

// setTimeout(() => {
//     console.log('инициируем нажатие на кнопку с id="DownloadMP4HD"')
//     // инициируем нажатие на кнопку с id="DownloadMP4HD"
//     page.click('#DownloadMP4HD');
// }, 500);





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









(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', // замените на путь к вашему Edge
            //headless: false // открывает браузер в режиме с графическим интерфейсом
        });
        console.log('Браузер успешно открыт');

        const page = await browser.newPage();

        const pagePromise = page.goto('https://www.downloadvideosfrom.com/ru/VK.php#GoogleBetweenAd', 
        { waitUntil: 'load' });
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000));
    
        const result = await Promise.race([pagePromise, timeoutPromise]);
    
        if (result === pagePromise) {
          console.log('Страница загружена');
          // Ваш код здесь...
        } else {
          console.log('Время ожидания истекло');
          // Обработайте ошибку загрузки страницы
        }

        setTimeout(() => {
            console.log('вставляем текстовую строку в поле ввода с id="url"');
            // вставляем текстовую строку в поле ввода с id="url"
            page.evaluate(() => {
                document.querySelector('#url').value = 'https://vk.com/video-72495085_456242529';
            });

            setTimeout(() => {
                console.log('инициируем нажатие на кнопку с id="DownloadMP4HD"')
                // инициируем нажатие на кнопку с id="DownloadMP4HD"
                page.click('#DownloadMP4HD');
            }, 500);

        }, 5000);

    } catch (error) {
        console.error('Произошла Ошибка:', error);
    }
})();












// (async () => {
//     try {
//         const browser = await puppeteer.launch({
//             executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 
//         });
//         const page = await browser.newPage();
//         await page.goto('https://www.downloadvideosfrom.com/ru/VK.php#GoogleBetweenAd'); 
//     } catch (error) {
//         console.error('Произошла ошибка:', error);
//     }
// })();















// (async () => {
//     const browser = await puppeteer.launch({
//         executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', // замените на путь к вашему Edge
//     });
//     const page = await browser.newPage();
//     await page.goto('https://www.downloadvideosfrom.com/ru/VK.php#GoogleBetweenAd'); 

// //   // ждем, пока страница полностью не загрузится
// //   await page.waitForNavigation({ waitUntil: 'networkidle0' });

// //   // вставляем текстовую строку в поле ввода с id="url"
// //   await page.evaluate(() => {
// //     document.querySelector('#url').value = 'https://vk.com/video-72495085_456242529';
// //   });

// //   // инициируем нажатие на кнопку с id="DownloadMP4HD"
// //   await page.click('#DownloadMP4HD');

// //   // ждем, пока файл полностью не загрузится
// //   // это может быть сложно, так как Puppeteer не предоставляет прямого способа отслеживания загрузки файлов
// //   // вместо этого, вы можете использовать некоторые обходные пути, например, проверять наличие файла в директории загрузки через некоторые интервалы времени

// //   // написать в консоли сообщение об успешной загрузке
// //   console.log('Файл успешно загружен');

// //   //await browser.close();
// })();
