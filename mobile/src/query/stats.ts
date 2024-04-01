import { gql } from "@apollo/client";

export const GET_STATS_BY_PERIOD = gql`
	query getStatsByPeriod($from: Int!, $to: Int!, $profileId: String!) {
		getStatsByPeriod(from: $from, to: $to, profileId: $profileId) {
            createdPhrasesTotal
            createdCollectionsTotal
            createdPhrasesAverage
            createdCollectionsAverage
            repeatedPhrasesTotal
            repeatedCollectionsTotal
            repeatedPhrasesAverage
            repeatedCollectionsAverage
            rightAnswersAveragePercentage
            favoriteLearningMethod
            visitedDays
            date {
                from
                to
            }
            dailyStats {
                day
                profileId
                createdCollections
                createdPhrases
                recordCreated
            }
            dailyRepetitions {
                day
                repeatedCollections
                repeatedPhrases
                learningMethods {
                    cards
                    aiGeneratedText
                    description
                }
        }
        }
	}
`;

export const REPORT_VISIT = gql`
    mutation reportVisit($userId: String!, $day: Int!) {
        reportVisit(userId: $userId, day: $day)
    }
`;