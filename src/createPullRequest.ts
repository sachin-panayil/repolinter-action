import * as core from '@actions/core'
import Octokit from './getOctokit'
import {Base64} from 'js-base64'

export interface CreatePROpts {
  owner: string
  repo: string
  username: string
  missingFiles: string[]
  templates?: {[key: string]: string}
  baseBranch: string
}

type Octo = InstanceType<typeof Octokit>

export const DEFAULT_TEMPLATES: {[key: string]: string} = {
  'README.md': "This is a README!"
}

export async function createPullRequest(
  client: Octo,
  options: CreatePROpts
): Promise<number | null> {
  const branchName = `repolinter/add-missing-files-${Date.now()}`
  const templates = options.templates || DEFAULT_TEMPLATES

  try {
    const baseRef = await client.git.getRef({
      owner: options.owner,
      repo: options.repo,
      ref: `heads/${options.baseBranch}`
    })

    await client.git.createRef({
      owner: options.owner,
      repo: options.repo,
      ref: `refs/heads/${branchName}`,
      sha: baseRef.data.object.sha
    })

    for (const file of options.missingFiles) {
      if (templates[file]) {
        await client.repos.createOrUpdateFileContents({
          owner: options.owner,
          repo: options.repo,
          path: file,
          message: `Add ${file} template`,
          content: templates[file],
          branch: branchName
        })
      }
    }

    const pr = await client.pulls.create({
      owner: options.owner,
      repo: options.repo,
      title: 'Add missing repository files',
      body: "This PR adds the following template files that were detected as missing by Repolinter",
      head: branchName,
      base: options.baseBranch
    })

    core.info(`Created PR #${pr.data.number}`)
    return pr.data.number
  } catch (error) {
    core.error('Failed to create pull request')
    throw error
  }
}
