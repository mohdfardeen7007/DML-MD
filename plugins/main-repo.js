const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch GitHub repository information",
    react: "🚀",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/MLILA17/DML-MD';

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("❌ Erreur : L'URL du repo est invalide.");

        const [, username, repoName] = match;

        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
            headers: {
                'User-Agent': 'DML-MD'
            }
        });

        if (response.status === 503) {
            return reply("❌ GitHub est temporairement indisponible (503). Réessaie plus tard.");
        }

        if (!response.ok) {
            return reply(`❌ Error: connect ETIMEDOUT Code: ${response.status}`);
        }

        const repoData = await response.json();

        const message = `┌──────────────────────┐
│  🚨 DML-MD REPO  🚀
├──────────────────────
│ • Name: ${repoData.name}
│ • Owner: ${repoData.owner.login}
│ • Stars: ${repoData.stargazers_count}
│ • Forks: ${repoData.forks_count}
│ • URL: ${repoData.html_url}
│ • Desc: ${repoData.description || 'None'}
└──────────────────────┘
> *POWERED BY DML-TECH*`;

        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/vcdwmp.jpg` },
            caption: message,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363387497418815@newsletter',
                    newsletterName: config.OWNER_NAME || 'DML-SITE',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Repo command error:", error);
        reply("❌ An error occurred while fetching the repository.");
    }
});
