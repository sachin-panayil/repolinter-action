[![New Relic Experimental header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#new-relic-experimental)

# Repolinter Action v1

[![GitHub Marketplace version](https://img.shields.io/github/release/newrelic/repolinter-action.svg?label=Marketplace&logo=github)](https://github.com/marketplace/actions/repolinter-action) ![Release](https://github.com/newrelic/repolinter-action/workflows/Release/badge.svg?event=push) [![codecov](https://codecov.io/gh/newrelic/repolinter-action/branch/main/graph/badge.svg?token=EWYZ7C6RSL)](https://codecov.io/gh/newrelic/repolinter-action) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/newrelic/repolinter-action.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/newrelic/repolinter-action/context:javascript)

This action runs [Repolinter](https://github.com/todogroup/repolinter) on your repository. Repolinter's optional external dependencies (licensee, linguist, github-markup) are installed using a docker build step. Optionally you can also configure this tool to create GitHub issues with the Repolinter output.

Currently this action uses the [newrelic-forks/repolinter](https://github.com/newrelic-forks/repolinter) fork, which includes a number of changes needed for issue creation support. A [PR](https://github.com/todogroup/repolinter/pull/174) to merge this fork into Repolinter is underway.

## Inputs

```yaml
- uses: repolinter-action@v1
  with:
    # The directory Repolinter should run against. Accepts an absolute path
    # or a path relative to $GITHUB_WORKSPACE.
    #
    # Defaults to $GITHUB_WORKSPACE.
    directory: ''

    # A path to the JSON/YAML Repolinter ruleset to use, relative to the workflow
    # working directory (i.e. under `$GITHUB_WORKSPACE`).
    #
    # This option is mutually exclusive with config_url. If this option and
    # config_url are not specified, Repolinter's default ruleset will be used.
    config_file: ''

    # A URL to pull the JSON/YAML Repolinter ruleset from. This URL must be accessible
    # by the actions runner and return raw JSON file on GET.
    #
    # This option can be used to pull a ruleset from GitHub using the
    # raw.githubusercontent.com URL (ex. https://raw.githubusercontent.com/aperture-science-incorporated/.github/master/repolinter-newrelic-communityplus.json).
    #
    # This option is mutually exclusive with config_file. If this option and
    # config_file are not specified, Repolinter's default ruleset will be used.
    config_url: ''

    # Where repolinter-action should put the linting results. There are two
    # options available:
    # * "exit-code": repolinter-action will print the lint output to the console
    #   and set the exit code to result.passed. This output type is most useful for
    #   PR status checks.
    # * "issue": repolinter-action will create a GitHub issue on the current
    #   repository with the repolinter output and always exit 0. See the README for
    #   more details on issue outputting behavior. This output type is ideal for
    #   non-intrusive notification.
    #
    # Default: "exit-code"
    output_type: ''

    # The title to use for the issue created by repolinter-action. This title
    # should indicate the purpose of the issue, as well as that it was created by
    # a bot.
    #
    # This option will be ignored if output_type != "issue".
    #
    # Default: "[Repolinter] Open Source Policy Issues"
    output_name: ''

    # The name to use for the issue label created by repolinter-action. This name
    # should be unique to repolinter-action (i.e. not used by any other issue) to
    # prevent repolinter-action from getting confused.
    #
    # This option will be ignored if output_type != "issue".
    #
    # Default: "repolinter"
    label_name: ''

    # The color to use for the issue label created by repolinter-action. The value
    # for this option should be an unprefixed RRGGBB hex string (ex. ff568a).
    # The default value is a shade of yellow.
    #
    # This option will be ignored if output_type != "issue".
    #
    # Default: "fbca04"
    label_color: ''

    # Personal access token (PAT) used to create an issue on this repository.
    # This token is optional and only required if this actions is configured to
    # output an issue (see `output_type`). This token must have the `public_repo`
    # scope for the current repository in order to work properly.
    #
    # [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
    #
    # Default: ${{ github.token }}
    token: ''

    # The username associated with the `token` field. Repolinter-action uses
    # this value to determine which issues have been created by itself. Prefix
    # this value with `app/` if `token` is generated from a GitHub app instead
    # of a normal user (see https://docs.github.com/en/github/searching-for-information-on-github/searching-issues-and-pull-requests#search-by-author).
    #
    # Defaults to the username associated with the `GITHUB_TOKEN` provided by Github
    # Actions.
    #
    # Default: app/github-actions
    username: ''

    # The repository name and owner, formatted like so: `owner/repository`.
    # This input determines which repository repolinter-action will create
    # an issue on, if that functionality is enabled.
    #
    # It is recommended that this option is left as the default value.
    #
    # Default: ${{ github.repository }}
    repository: ''
```

## Outputs

| Key           | Type    | Description                                                                                                   |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `passed`      | boolean | A boolean indicating whether or not the ruleset passed, equivalent to `LintResult#passed`.                    |
| `errored`     | boolean | A boolean indicating whether or or not any errors occurred when running repolinter-action                     |
| `json_output` | string? | The JSON-ified repolinter output from `repolinter.jsonFormatter`. Will only be present if `errored` is false. |

## Usage

### Validate master branch with the default ruleset

The following will run Repolinter with the default ruleset on every push to master, and exit with status 1 if the repository does not pass.

```yaml

name: 'Validate master branch with Repolinter'

on:
  push:
    branches:
      - master

jobs:
  repolinter-action:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: 'Run Repolinter'
        uses: newrelic/repolinter-action@v1

```

### Validate master branch with a remote ruleset

The following will run Repolinter with a [remote ruleset](https://raw.githubusercontent.com/aperture-science-incorporated/.github/master/repolinter-newrelic-communityplus.json) on every push to master, and exit with status 1 if the repository does not pass.

```yaml

name: 'Validate master branch with Repolinter'

on:
  push:
    branches:
      - master

jobs:
  repolinter-action:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: 'Run Repolinter'
        uses: newrelic/repolinter-action@v1
        with:
          config_url: https://raw.githubusercontent.com/aperture-science-incorporated/.github/master/repolinter-newrelic-communityplus.json

```

### Open an issue on validation fail

The following will run repolinter with a [remote ruleset](https://raw.githubusercontent.com/aperture-science-incorporated/.github/master/repolinter-newrelic-communityplus.json) on every push to master, and open a GitHub issue if the repository does not pass.

```yaml
name: 'Validate master branch with Repolinter'

on:
  push:
    branches:
      - master

jobs:
  # Because the output-type is set to 'issue', this job will always succeed.
  repolinter-action:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: 'Run Repolinter'
        uses: newrelic/repolinter-action@v1
        with:
          config_url: https://raw.githubusercontent.com/aperture-science-incorporated/.github/master/repolinter-newrelic-communityplus.json
          output_type: issue
          # Optionally you can customize the issue and label repolinter-action will create
          output_name: '[Bot] My Issue Title'
          label_name: 'my-repolinter-label'
          label_color: 'ffffff'
```

### Run against another repository

The following will run repolinter with the default ruleset against [aperture-science-incorporated/companion-cube](https://github.com/aperture-science-incorporated/companion-cube) on every push to master of the current repository; if the ruleset does not pass, repolinter-action will open a GitHub issue on companion-cube. Note that a custom personal access token (`MY_TOKEN`) and PAT username (`my-token-username`) must be specified, as `GITHUB_TOKEN` [does not have write permission for repositories other than the current one](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#about-the-github_token-secret).

```yaml
name: Apply Repolinter
on:
  push:
    branches:
      - master

jobs:
  apply-repolinter:
    name: Apply Repolinter Somewhere Else
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
        with:
          repository: aperture-science-incorporated/companion-cube

      - name: Run Repolinter
        uses: newrelic/repolinter-action@develop
        with:
          output_type: issue
          repository: aperture-science-incorporated/companion-cube
          username: my-token-username
          token: ${{ secrets.MY_TOKEN }}
```

## Issue Creation Behavior

If `output_type` is set to `issue`, repolinter-action will create a GitHub issue with the Repolinter output on the current repository. An example issue can be found here: https://github.com/aperture-science-incorporated/companion-cube/issues/44.

To prevent unnecessary noise, repolinter-action will first attempt to edit an existing open issue before creating a new one. This check is performed every workflow run, and can be emulated using the following [GitHub search](https://docs.github.com/en/github/searching-for-information-on-github) query:
```
type:issue repo:<the current repo> creator:<username> label:<label-name> state:open sort:author-date-desc
```
If no issues are returned by this query, repolinter-action will create a new one. If more than one issue is returned by this query, repolinter-action will edit the first issue in the list (the issue most recently created) and ignore the others.

### Consistency

As GitHub Actions can run many workflows in parallel, repolinter-action runs may happen in a different order than commits occurred. To prevent out-of-order action runs from generating issue noise, repolinter-action will first search the body of the most recently created repolinter-action issue (open or closed) for a magic string containing the [`GITHUB_RUN_NUMBER`](https://docs.github.com/en/free-pro-team@latest/actions/reference/environment-variables#about-environment-variables) of the last run that updated the issue. If the run number present in the issue is greater than the local `GITHUB_RUN_NUMBER`, repolinter-action will assume that its results are out of date and will not modify the issue. If the magic string is invalid, not present, or contains a lower run number, repolinter-action will assume its results are up to date and perform its modifications. This magic string is encoded as follows:
```md
<!-- repolinter-action-workflow-number:<GITHUB_RUN_NUMBER> -->
```

## Contributing

We encourage your contributions to improve Repolinter Action! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company,  please drop us an email at opensource@newrelic.com.

## License

repolinter-action is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.

> This repo also uses source code from third-party libraries. You can find full details on which libraries are used and the terms under which they are licensed in the [third-party-notices](./THIRD_PARTY_NOTICES.md) document.
 
 ## About the Project 
<!-- This should be a longer-form description of the project. It can include history, background, details, problem statements, links to design documents or other supporting materials, or any other information/context that a user or contributor might be interested in. --> 
 
 ## Core Team 
An up-to-date list of core team members can be found in [MAINTAINERS.md](MAINTAINERS.md). At this time, the project is still building the core team and defining roles and responsibilities. We are eagerly seeking individuals who would like to join the community and help us define and fill these roles. 
 
 ## Documentation Index 
<!-- TODO: This is a like a 'table of contents' for your documentation. Tier 0/1 projects with simple README.md files without many sections may or may not need this, but it is still extremely helpful to provide 'bookmark' or 'anchor' links to specific sections of your file to be referenced in tickets, docs, or other communication channels. --> 
 **{list of .md at top directory and descriptions}** 
 
 ## Repository Structure 
<!-- TODO: Using the 'tree -d' command can be a helpful way to generate this information, but, be sure to update it as the project evolves and changes over time. --> 
 <!--TREE START--><!--TREE END--> 
 **{list directories and descriptions}** 
 
 ## Development and Software Delivery Lifecycle 
The following guide is for members of the project team who have access to the repository as well as code contributors. The main difference between internal and external contributions is that external contributors will need to fork the project and will not be able to merge their own pull requests. For more information on contributing, see: [CONTRIBUTING.md](./CONTRIBUTING.md). 
 
 ## Local Development 
<!--- TODO - with example below: 
This project is monorepo with several apps. Please see the [api](./api/README.md) and [frontend](./frontend/README.md) READMEs for information on spinning up those projects locally. Also see the project [documentation](./documentation) for more info. --> 
 
 ## Coding Style and Linters 
<!-- TODO - Add the repo's linting and code style guidelines --> 
 Each application has its own linting and testing guidelines. Lint and code tests are run on each commit, so linters and tests should be run locally before commiting. 
 
 ## Branching Model 
 <!-- TODO - with example below:
 This project follows [trunk-based development](https://trunkbaseddevelopment.com/), which means:

* Make small changes in [short-lived feature branches](https://trunkbaseddevelopment.com/short-lived-feature-branches/) and merge to `main` frequently.
* Be open to submitting multiple small pull requests for a single ticket (i.e. reference the same ticket across multiple pull requests).
* Treat each change you merge to `main` as immediately deployable to production. Do not merge changes that depend on subsequent changes you plan to make, even if you plan to make those changes shortly.
* Ticket any unfinished or partially finished work.
* Tests should be written for changes introduced, and adhere to the text percentage threshold determined by the project.

This project uses **continuous deployment** using [Github Actions](https://github.com/features/actions) which is configured in the [./github/workflows](.github/workflows) directory.

Pull-requests are merged to `main` and the changes are immediately deployed to the development environment. Releases are created to push changes to production.--> 
 
 ## Codeowners 
The contents of this repository are managed by **{responsible organization(s)}**. Those responsible for the code and documentation in this repository can be found in [CODEOWNERS.md](CODEOWNERS.md). 
 
 ## Community Guidelines 
Principles and guidelines for participating in our open source community are can be found in [COMMUNITY_GUIDELINES.md](COMMUNITY_GUIDELINES.md). Please read them before joining or starting a conversation in this repo or one of the channels listed below. All community members and participants are expected to adhere to the community guidelines and code of conduct when participating in community spaces including: code repositories, communication channels and venues, and events. 
 
 ## Feedback 
If you have ideas for how we can improve or add to our capacity building efforts and methods for welcoming people into our community, please let us know at **{contact_email}**. If you would like to comment on the tool itself, please let us know by filing an **issue on our GitHub repository.** 
 
 ## Policies 
 
 ### Security and Responsible Disclosure Policy 
*Submit a vulnerability:* Vulnerability reports can be submitted through [Bugcrowd](https://bugcrowd.com/cms-vdp). Reports may be submitted anonymously. If you share contact information, we will acknowledge receipt of your report within 3 business days.
For more information about our Security, Vulnerability, and Responsible Disclosure Policies, see [SECURITY.md](SECURITY.md). 
 
 ## Public Domain 
This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/) as indicated in [LICENSE](LICENSE).
All contributions to this project will be released under the CC0 dedication. By submitting a pull request or issue, you are agreeing to comply with this waiver of copyright interest.
 
 ### Software Bill of Materials (SBOM) 
A Software Bill of Materials (SBOM) is a formal record containing the details and supply chain relationships of various components used in building software.
In the spirit of [Executive Order 14028 - Improving the Nation's Cyber Security](https://www.gsa.gov/technology/it-contract-vehicles-and-purchasing-programs/information-technology-category/it-security/executive-order-14028), a SBOM for this repository is provided here: https://github.com/{repo_org}/{repo_name}/network/dependencies.
For more information and resources about SBOMs, visit: https://www.cisa.gov/sbom.