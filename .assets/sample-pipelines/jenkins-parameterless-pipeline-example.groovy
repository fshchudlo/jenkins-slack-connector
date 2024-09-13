pipeline {
    agent {
        label 'my-node'
    }
    stages {
        stage('Test stage 1') {
            steps {
                script {
                    print 'I\'m working'
                    sleep(time: 3, unit: 'SECONDS')
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
