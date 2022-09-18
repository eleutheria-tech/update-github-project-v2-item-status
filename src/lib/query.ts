import { debug, error } from '@actions/core'
import { getOctokit } from '@actions/github'
import { GraphqlResponseError } from '@octokit/graphql'
import { Mutation } from '@octokit/graphql-schema'
import {
  getIssueOrPRTitleFromItem,
  getSsfNameFromItem,
  getSsfOptionNameFromItem,
  getURLFromItem
} from './getter'

export type SimpleItem = {
  issueOrPRTitle: string
  url: string
  ssfName: string
  ssfOptionName: string
  projectTitle: string
  projectURL: string
}

export const execUpdateSsfQuery = async (
  ghToken: string,
  projectId: string,
  itemId: string,
  ssfId: string,
  ssfOptionId: string
): Promise<SimpleItem> => {
  const octokit = getOctokit(ghToken)

  const variables = {
    project_id: projectId,
    item_id: itemId,
    field_id: ssfId,
    field_option_id: ssfOptionId
  }

  const query = `
        mutation($project_id: ID! $item_id: ID! $field_id: ID! $field_option_id: String!) {
            updateProjectV2ItemFieldValue(
                input: {
                    projectId: $project_id
                    itemId: $item_id
                    fieldId: $field_id
                    value: {
                        singleSelectOptionId: $field_option_id
                    }
                }
            ) {
                projectV2Item {
                    id
                    type
                    project {
                      title
                      url
                    }
                    content {
                        __typename
                        ...on Issue {
                            number
                            title
                            url
                        }
                        ... on PullRequest {
                            number
                            title
                            url
                        }
                    }
                    fieldValues(first: 20) {
                        ... on ProjectV2ItemFieldValueConnection {
                            nodes {
                                __typename
                                ... on ProjectV2ItemFieldSingleSelectValue {
                                    field {
                                        ... on ProjectV2SingleSelectField {
                                            id
                                            name
                                        }
                                    }
                                    optionId
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `

  try {
    const result: Mutation = await octokit.graphql(query, variables)
    debug(`result: ${JSON.stringify(result)}`)

    const payload = result.updateProjectV2ItemFieldValue

    if (!payload) {
      throw new Error('[Payload NOT FOUND]')
    }

    const { projectV2Item } = payload

    if (!projectV2Item) {
      throw new Error('[Project V2 Item NOT FOUND]')
    }

    const issueOrPRTitle = getIssueOrPRTitleFromItem(projectV2Item)
    const url = getURLFromItem(projectV2Item)
    const ssfName = getSsfNameFromItem(projectV2Item)
    const ssfOptionName = getSsfOptionNameFromItem(projectV2Item)
    const projectTitle = projectV2Item.project.title
    const projectURL = projectV2Item.project.url

    return {
      issueOrPRTitle,
      url,
      ssfName,
      ssfOptionName,
      projectTitle,
      projectURL
    }
  } catch (err) {
    if (err instanceof GraphqlResponseError) {
      error(JSON.stringify(err.request))
      error(err.message)
      throw new Error('[GraphQL Request FAILED]')
    } else throw err
  }
}
