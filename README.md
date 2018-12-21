# Puppeteer-CLI
Command line interface for Puppeteer

## Installation

Chrome needs all these dependencies to be installed :
```bash
sudo apt install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```
Then, we can install the project :
```bash
git clone https://github.com/Cooya/Puppeteer-CLI.git
cd Puppeteer-CLI
npm install
```

## Execution
The port 9222 needs to be free. To run the tool :
```bash
node cli.js -u google.com
```
The page HTML content will be printed.

## Usage
```
Usage: cli.js -u URL [-o OUTPUT_FILE] [-s SCREENSHOT_FILE] [-p SERVER:PORT]
[--displayBrowser]

Options:
  -u, --url             Target URL to get the HTML from      [string] [required]
  -o, --outputFile      Output file for the HTML content                [string]
  -s, --screenshotFile  Destination file for the screenshot             [string]
  -p, --proxy           Proxy server to use                             [string]
  --displayBrowser      Display the web browser (cannot be used on a server)
                                                      [boolean] [default: false]
  -h, --help            Show help                                      [boolean]
  ```
