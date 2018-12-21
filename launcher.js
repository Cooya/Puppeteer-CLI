const puppeteer = require('puppeteer');

(async () => {
	try {
		const options = {
			headless: true,
			devtools: false,
			ignoreHTTPSErrors: true,
			args: [
				`--no-sandbox`,
				`--disable-setuid-sandbox`,
				`--ignore-certificate-errors`
			]
		};
		const browser = await puppeteer.launch(options);
		let pagesCount = await browser.pages();
		const browserWSEndpoint = await browser.wsEndpoint();
		// console  WSEndPoint say : "ws://127.0.0.1:42207/devtools/browser/dbb2525b-ce44-43c2-a335-ff15d0306f36"
		console.log('browserWSEndpoint----- :> ', browserWSEndpoint);
		await browser.disconnect();
		return browserWSEndpoint;
	} catch (err) {
		console.error(err);
		process.exit(1);
		return false;
	}
})();