# Integrate autofill feature with Github Actions

### Prerequisite
Before following this tutorial, please make sure to have an active Github account.

### Steps
1. Fork the [project repository](https://github.com/bernardadhitya/intern-logbook-chatbot) to your Github account

2. Make a github token to access the repository. This is used to make a local daily log of your logbook.
![test](autofill-github-actions-assets/1.png)
![test](autofill-github-actions-assets/2.png)
![test](autofill-github-actions-assets/3.png)
![test](autofill-github-actions-assets/4.png)
![test](autofill-github-actions-assets/5.png)
> Copy the token immediately. It will not show itself once you refresh/reload the page.

3. Make repository secrets. Store these values
![test](autofill-github-actions-assets/6.png)
![test](autofill-github-actions-assets/7.png)

| Name | Value |
| ---- | ----- |
| `MY_GITHUB_TOKEN` | Paste your github token you previously made |
| `MY_GITHUB_EMAIL` | Your github account email |
| `MY_GITHUB_USERNAME` | Your github username |
| `MY_USERNAME` | Your BINUS ID (NIM) |
| `MY_PASSWORD` | Your account password |

![test](autofill-github-actions-assets/8.png)
> Secrets are encrypted and is only accessable by the repository in your own account, so it won't be visible to anyone.


That's it! Github Actions will use that value to access the repository and your logbook account to automatically fill your logbook.


