pipeline {
    agent {
        label 'my-node'
    }
    stages {
        stage('Test stage 1') {
            steps {
                script {
                    print 'I\'m working'
                }
            }
        }
        stage('Test stage 2') {
            steps {
                script {
                    sendInputRequestToTheSlack()
                    input(
                            id: 'some-approval',
                            message: 'Please, choose parameters and press "Continue"',
                            parameters: [
                                    stringParam(name: 'someStringParam', defaultValue: '', description: 'Some string popup param'),
                                    booleanParam(name: 'someBooleanPopupParam', description: 'Some boolean popup param')
                            ],
                            ok: 'Continue'
                    )

                    print 'Continue working'
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

def sendInputRequestToTheSlack() {
    def authorId = slackUserIdFromEmail(currentBuild.rawBuild.getCause(Cause.UserIdCause)?.getUserId())
    if (authorId == null) {
        return
    }

    def message = ":keyboard: <${env.BUILD_URL}|${env.JOB_BASE_NAME}> requested some input. <${env.RUN_DISPLAY_URL}|Please, provide it here>"

    slackSend(message: message, sendAsText: true, channel: authorId, botUser: true, tokenCredentialId: 'jenkins-slack-connector-bot-token')
}
