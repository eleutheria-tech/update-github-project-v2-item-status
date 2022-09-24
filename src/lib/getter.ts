import {
  ProjectV2Item,
  Issue,
  PullRequest,
  ProjectV2ItemFieldSingleSelectValue
} from '@octokit/graphql-schema'

export const getIssueOrPRFromItem = (
  item: ProjectV2Item
): Issue | PullRequest => {
  return item.content as Issue | PullRequest
}

export const getIssueOrPRTitleFromItem = (item: ProjectV2Item): string => {
  return getIssueOrPRFromItem(item).title
}

export const getIssueOrPRNumberFromItem = (item: ProjectV2Item): number => {
  return getIssueOrPRFromItem(item).number
}

export const getURLFromItem = (item: ProjectV2Item): string => {
  const isIssue = item.content?.__typename === 'Issue'
  const isPR = item.content?.__typename === 'PullRequest'

  if (isIssue || isPR) {
    const issueOrPR = item.content as Issue | PullRequest
    return issueOrPR.url
  } else {
    return 'This is a Draft Issue. No URL'
  }
}

export const getSsfNameFromItem = (item: ProjectV2Item): string => {
  const { nodes } = item.fieldValues

  if (!nodes) {
    return ''
  }

  const ssf = nodes.find(
    node => node?.__typename === 'ProjectV2ItemFieldSingleSelectValue'
  )

  if (!ssf) {
    return ''
  }

  const { field } = ssf as ProjectV2ItemFieldSingleSelectValue
  return field.name
}

export const getSsfOptionNameFromItem = (item: ProjectV2Item): string => {
  const { nodes } = item.fieldValues

  if (!nodes) {
    return ''
  }

  const ssf = nodes.find(
    node => node?.__typename === 'ProjectV2ItemFieldSingleSelectValue'
  )

  if (!ssf) {
    return ''
  }

  const { name } = ssf as ProjectV2ItemFieldSingleSelectValue
  return name ?? ''
}
