import container from "../config/inversify_config"
import {ManageStorageData} from "../storage/manage.storage.data"

export const findApiKeyHeader = (): Record<string, string> => {
  const manageStorageData = container.get<ManageStorageData>('ManageStorageData')
  const apiKey = manageStorageData.findApiKey()

  if (apiKey) {
    return {'X-Recoble': apiKey}
  } else {
    throw new Error("Recoble API Key Not Found")
  }
}
