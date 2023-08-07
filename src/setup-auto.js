/*eslint no-undef: "off"*/
/*eslint no-trailing-spaces: "off"*/
/*eslint no-unused-vars: "off"*/

const core = require("@actions/core");
const path = require("path");
const io = require("@actions/io");
const hc = require("@actions/http-client");
const tc = require("@actions/tool-cache");
const fs = require("fs");

async function setupAutoCLI() {
    const tempDownloadFolder = 'temp_' + Math.floor(Math.random() * 2000000000);
    const tempDirectory = process.env['RUNNER_TEMP'] || '';
    const tempDir = path.join(tempDirectory, tempDownloadFolder);

    await io.mkdirP(tempDir);

    const downloadUrl = "https://github.com/intuit/auto/releases/download/v11.0.0/auto-linux.gz";
    const downloadPath = await tc.downloadTool(downloadUrl);
    const extPath = tc.extractTar(downloadPath, tempDir, [
        'xz',
        '--strip',
        '1'
    ]);
    
    core.info(`downloadPath: ${downloadPath}`);
    core.info(`extPath: ${extPath}`);
    core.info(`tempDir: ${tempDir}`);
    const directories = await fs.readdirSync(tempDir);

    core.info(directories);
    io.cp(
        path.join(tempDir, "auto-linux"),
        path.join(tempDir, "auto"),
    );
    // io.cp(
    //     path.join(tempDir, "auto-linux"),
    //     "/usr/local/bin/auto",
    // );
    core.info("Successfully downloaded auto and extracted it");
    core.addPath(path.join(tempDir, "auto"));
}

module.exports = { setupAutoCLI };
