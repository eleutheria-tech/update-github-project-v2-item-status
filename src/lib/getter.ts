import {
  ProjectV2Item,
  Issue,
  PullRequest,
  ProjectV2ItemFieldSingleSelectValue
} from '@octokit/graphql-schema'

export const getIssueOrPRTitleFromItem = (item: ProjectV2Item): string => {
  return item.content?.title ?? 'No Title'
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
