const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const util = require('util');
const yargs = require('yargs');

const writeFile = util.promisify(fs.writeFile);

const argv = yargs
	.usage('Usage: $0 -u URL [-o OUTPUT_FILE] [-s SCREENSHOT_FILE] [-p SERVER:PORT] [--headless]')
	.version(false)

	.nargs('u', 1)
	.alias('u', 'url')
	.describe('u', 'Target URL to get the HTML from')
	.demandOption('u')
	.string('u')

	.nargs('o', 1)
	.alias('o', 'outputFile')
	.describe('o', 'Output file for the HTML content')
	.string('o')

	.nargs('s', 1)
	.alias('s', 'screenshotFile')
	.describe('s', 'Destination file for the screenshot')
	.string('s')

	.nargs('p', 1)
	.alias('p', 'proxy')
	.describe('p', 'Proxy server to use')
	.string('p')

	.option('headless', {
		default: true,
		describe: 'Display the web browser',
		type: 'boolean'
	})

	.help('h')
	.alias('h', 'help')
	.argv;

(async () => {
	const url = argv.url.match(/http:\/\/|https:\/\//) ? argv.url : 'http://' + argv.url;
	const outputFile = argv.outputFile && path.resolve(argv.outputFile);
	const screenshotFile = argv.screenshotFile && path.resolve(argv.screenshotFile);

	let browser;
	try {
		browser = await puppeteer.launch({
			headless: argv.headless,
			args: argv.proxy ? ['--proxy-server=' + argv.proxy] : []
		});
		const page = await browser.newPage();
		await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0');
		await page.setViewport({ width: 1600, height: 900 });
		await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' });
		//console.debug('Going to "%s"...', url);
		await page.goto(url, {waitUntil: 'networkidle2'});
		if(screenshotFile) await page.screenshot({path: screenshotFile});
		const pageContent = await page.content();
		if(outputFile)
			await writeFile(outputFile, pageContent);
		else
			console.log(pageContent);
	}
	catch(e) {
		console.error(e);
	}
	await browser.close();
})();