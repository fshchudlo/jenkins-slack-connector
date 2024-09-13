import "dotenv/config";

export const AppConfig = {
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
    SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN,
    SLACK_BOT_PORT: process.env.SLACK_BOT_PORT,
    JENKINS_URL: process.env.JENKINS_URL,
    JENKINS_CREDENTIALS: {
        username: process.env.JENKINS_API_USER,
        password: process.env.JENKINS_API_TOKEN
    }
};
