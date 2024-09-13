# This is repo is not for production running. This is just a quick sample for my article about creating Slack bots.

# jenkins-slack-connector

Slack app [built on top of Slack Bolt](https://slack.dev/bolt-js/tutorial/getting-started) to run Jenkins pipelines with Slack commands

### Configuring dev environment

- Install [Node.js and npm](https://nodejs.org) on your machine
- Run `npm i` from the repo root directory
- Configure Slack application to get required tokens. You can use "Create an app" and "Tokens and installing apps"
  sections [from this Slack guide](https://slack.dev/bolt-js/tutorial/getting-started#create-an-app). You can
  use `./slack_app_manifest.yml` file as a basis to create your own app and assign all the required oauth scopes.
- Create the copy of `.env.example` file, name it `.env` and provide relevant config values.
- Run ```npm run start```

### Running unit tests
- Easy as ```npm run test```.
- Since I'm a lazy guy, tests use snapshots. You can update them by running ```npm run test:update-snapshots```

### Running the service
- You can use provided `Dockerfile` to build an image and run it with ENV variables identical to variables
  specified in `.env.example` described above

### Useful links
- [Slack bolt getting started guide](https://slack.dev/bolt-js/tutorial/getting-started)
- [Slack apps configuration page](https://api.slack.com/apps)
- [Slack blocks kit builder](https://app.slack.com/block-kit-builder) and [full controls reference](https://api.slack.com/reference/block-kit/block-elements)
- [How to create slash commands](https://api.slack.com/interactivity/slash-commands)
- [How to provide an input to Jenkins through API](https://stackoverflow.com/questions/48799442/use-jenkins-rest-api-to-resume-a-paused-pipeline/50606237#50606237)