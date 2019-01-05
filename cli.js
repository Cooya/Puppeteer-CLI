#!/usr/bin/env node

const freePort = require('find-free-port');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const util = require('util');
const yargs = require('yargs');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const COOKIES_FILE = './cookies.json';

const argv = yargs
	.usage(
		'Usage: $0 -u URL [-o OUTPUT_FILE] [-s SCREENSHOT_FILE] [-p SERVER:PORT] [--displayBrowser]'
	)
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

	.option('displayBrowser', {
		describe: 'Display the web browser (cannot be used on a server)',
		type: 'boolean',
		default: false
	})

	.option('v', {
		alias: 'verbose',
		describe: 'Verbose mode',
		type: 'boolean',
		default: false
	})

	.help('h')
	.alias('h', 'help').argv;

(async () => {
	if (!argv.v) console.debug = () => {};

	const url = argv.url.match(/http:\/\/|https:\/\//) ? argv.url : 'http://' + argv.url;
	const outputFile = argv.outputFile && path.resolve(argv.outputFile);
	const screenshotFile = argv.screenshotFile && path.resolve(argv.screenshotFile);
	const args = [
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--ignore-certificate-errors',
		'--remote-debugging-port=' + (await freePort(3000, 3500))
	];

	if (argv.proxy) args.push('--proxy-server=' + argv.proxy);

	try {
		const browser = await puppeteer.launch({
			headless: !argv.displayBrowser,
			args
		});
		const page = await browser.newPage();
		await page.setUserAgent(
			'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0'
		);
		await page.setViewport({ width: 1600, height: 900 });
		await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' });

		console.debug('Going to "%s"...', url);
		await loadCookies(page, COOKIES_FILE);
		await page.goto(url, { waitUntil: 'networkidle2' });
		await saveCookies(page, COOKIES_FILE);

		if (screenshotFile) {
			console.debug('Taking screenshot...');
			await page.screenshot({ path: screenshotFile });
			console.debug('Screenshot saved.');
		}

		const pageContent = await page.content();
		if (outputFile) await writeFile(outputFile, pageContent);
		else console.log(pageContent);
		await browser.close();
	} catch (e) {
		console.error(e);
	}
})();

async function loadCookies(page, cookiesFile) {
	console.debug('Loading cookies...');
	let cookies;
	try {
		cookies = JSON.parse(await readFile(cookiesFile, 'utf-8'));
	} catch (e) {
		await writeFile(cookiesFile, '[]');
		console.debug('Empty cookies file created.');
		return;
	}
	await page.setCookie(...cookies);
	console.debug('Cookies loaded.');
}

async function saveCookies(page, cookiesFile) {
	console.debug('Saving cookies...');
	const cookies = JSON.stringify(await page.cookies());
	await writeFile(cookiesFile, cookies);
	console.debug('Cookies saved.');
}
