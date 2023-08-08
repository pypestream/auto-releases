/*eslint no-undef: "off"*/
/*eslint no-trailing-spaces: "off"*/
/*eslint no-unused-vars: "off"*/

const core = require("@actions/core");
const path = require("path");
const io = require("@actions/io");
const tc = require("@actions/tool-cache");
const shelljs = require("shelljs");


async function setupAutoCLI() {
    const tempDownloadFolder = 'temp_' + Math.floor(Math.random() * 2000000000);
    const tempDirectory = process.env['RUNNER_TEMP'] || '';
    const tempDir = path.join(tempDirectory, tempDownloadFolder);

    await io.mkdirP(tempDir);
    await io.mkdirP("/usr/local/bin/");

    const downloadPath = await tc.downloadTool(
        "https://github.com/intuit/auto/releases/download/v11.0.0/auto-linux.gz",
        "/usr/local/bin/auto-linux.gz"
    );
    
    core.debug(`File downloaded: ${downloadPath}`);

    const output = await shelljs.exec(`gzip -d ${downloadPath} && mv /usr/local/bin/auto-linux /usr/local/bin/auto && chmod x /usr/local/bin/auto`);
    
    core.info(output.stdout.trim());
    core.info(output.stderr.trim());

    await shelljs.exec(`ls -a /usr/local/bin/`);

    core.addPath("/usr/local/bin/auto");
    core.info(`Auto cli installed version: ${await shelljs.exec("auto --version").stdout.trim()}`);
    core.info("Setup finished for auto");
}

module.exports = { setupAutoCLI };
