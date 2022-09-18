import { execUpdateSsfQuery, SimpleItem } from './lib/query'

type UpdateGitHubProjectItemParams = {
  ghToken: string
  projectId: string
  itemIds: string[]
  ssfId: string
  ssfOptionId: string
}

export const updateGitHubProjectItemStatus = async ({
  ghToken,
  projectId,
  itemIds,
  ssfId,
  ssfOptionId
}: UpdateGitHubProjectItemParams): Promise<SimpleItem[]> => {
  const simpleItems: SimpleItem[] = []

  for (const itemId of itemIds) {
    const simpleItem: SimpleItem = await execUpdateSsfQuery(
      ghToken,
      projectId,
      itemId,
      ssfId,
      ssfOptionId
    )

    simpleItems.push(simpleItem)
  }

  return simpleItems
}
