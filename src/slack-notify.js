/*eslint no-undef: "off"*/

const axios = require('axios');
const core = require('@actions/core');

async function sendReleaseNotesToSlack(githubToken, slackToken, owner, repo, tag, channels) {
    try {
        // 1. Query GitHub API to get release by tag
        core.info(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`);
        const releaseResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        core.info(releaseResponse);
        core.info(releaseResponse.data.body);
        let releaseNotes = releaseResponse.data.body;

        // 2. Modify the release notes
        releaseNotes += "\n\n :rocket:";

        // Capitalize the repo name
        const capitalizedRepo = repo.charAt(0).toUpperCase() + repo.slice(1);

        // Include the @here mention
        const titleMessage = `@here - New release from ${capitalizedRepo}!\n`;

        const sendToChannel = async (channel) => {
            const slackPayload = {
                text: titleMessage + releaseNotes,
                channel: channel,
                icon_emoji: ':pypestream-newlogo:',
                username: "Pypestream"
            };

            await axios.post('https://slack.com/api/chat.postMessage', slackPayload, {
                headers: {
                    'Authorization': `Bearer ${slackToken}`,
                    'Content-Type': 'application/json'
                }
            });
        };

        // 3. Send release notes to each Slack channel in parallel
        await Promise.all(channels.map(channel => sendToChannel(channel)));

        core.info('Release notes sent to Slack channels successfully!');

    } catch (error) {
        core.error(error.message);
        throw error;
    }
}

module.exports = sendReleaseNotesToSlack;