properties([
        buildDiscarder(logRotator(numToKeepStr: '30')),
        parameters([
                string(name: 'someStringParam', description: """Description of `someStringParam` parameter.<br/>placed on several lines"""),
                choice(name: 'someChoiceParam', choices: ['one', 'two', 'three'], description: 'Description of `someChoiceParam`'),
                text(name: 'someTextParam', description: "Some multiline parameter", trim: true),
                booleanParam(name: 'someBooleanParam', description: 'Description of `someBooleanParam`')
        ])
])
pipeline {
    agent {
        label 'my-node'
    }
    stages {
        stage('Test stage 1') {
            steps {
                script {
                    print 'I\'m working'
                    sleep(time: 1, unit: 'SECONDS')
                }
            }
        }
    }
    post {
        always {
            script {
                def authorId = slackUserIdFromEmail(currentBuild.rawBuild.getCause(Cause.UserIdCause)?.getUserId())
                if (authorId) {
                    def message = currentBuild.result == 'SUCCESS' ? ":white_check_mark: `${env.JOB_BASE_NAME}` build <${env.BUILD_URL}|completed successfully>" : ":octagonal_sign: `${env.JOB_BASE_NAME}` build <${env.BUILD_URL}|had been failed>"
                    slackSend(message: message, sendAsText: true, channel: authorId, botUser: true, tokenCredentialId: 'jenkins-slack-connector-bot-token')
                }
            }
        }
    }
}