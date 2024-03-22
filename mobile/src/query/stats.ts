import { gql } from "@apollo/client";

export const GET_STATS_BY_PERIOD = gql`
	query getStatsByPeriod($period: String!, $profileId: String!) {
		getStatsByPeriod(period: $period, profileId: $profileId) {
        createdPhrasesTotal,
        createdCollectionsTotal,
        createdPhrasesAverage,
        createdCollectionsAverage,
        repeatedPhrasesTotal,
        repeatedCollectionsTotal,
        repeatedPhrasesAverage,
        repeatedCollectionsAverage,
        rightAnswersAveragePercentage,
        favoriteLearningMethod,
        visitedDays,
        visitedPercentage,
        dailyStats {
            date,
            profileId,
            createdCollections,
            createdPhrases
        },
        dailyRepetitions {
            date,
            repeatedCollections,
            repeatedPhrases,
            learningMethods {
                cards,
                aiGeneratedText,
                description
            }
        },
        date {
            from,
            to
        }
    }
	}
`;