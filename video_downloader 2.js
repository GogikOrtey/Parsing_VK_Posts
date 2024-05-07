// const puppeteer = require('puppeteer');
import puppeteer from 'puppeteer-core';










(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', // замените на путь к вашему Edge
            headless: false // открывает браузер в режиме с графическим интерфейсом
        });
        console.log('Браузер успешно открыт');
        // Закрываем браузер после 5 секунд

        const page = await browser.newPage();
        await page.goto('https://www.downloadvideosfrom.com/ru/VK.php#GoogleBetweenAd'); 
        // setTimeout(() => {
        //     browser.close();
        //     console.log('Браузер закрыт');
        // }, 5000);
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
