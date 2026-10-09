
# Self-Healing Locators

## 1. Objective

Self-healing locators help UI automation recover when a web element's
locator changes because of UI updates. A test can use an alternative
locator, but the recovered element must still be verified before
the test continues.

## 2. Potentially Brittle Locators

| Element | Brittle locator example | Why it may break | Preferred locator |
|---|---|---|---|
| Generate Report button | `button:nth-child(3)` | Breaks when button order changes | `getByRole('button', { name: 'Generate Report' })` |
| Campaign name field | `#input1` | Breaks if the ID changes | `getByRole('textbox', { name: 'Campaign name' })` |
| Impressions field | `div.form > input:nth-of-type(1)` | Breaks when the layout changes | `getByRole('spinbutton', { name: 'Impressions' })` |
| Clicks field | `#clicksInput` | Breaks if the ID changes | `getByRole('spinbutton', { name: 'Clicks' })` |
| Report result | `div:nth-child(5) > div` | Breaks when the page structure changes | `locator('#report-result')` |

These are examples of fragile locator patterns, not a claim that all
of them are currently used in the application.

## 3. Recovery Strategy

1. Try the primary locator.
2. If it fails, try a documented alternative locator.
3. Verify the recovered element using its accessible name, expected
   text, visibility, and relevant behavior.
4. Log the fallback locator used.
5. Fail the test if no candidate can be verified.
6. Review and update the primary locator rather than hiding recurring
   application changes.

## 4. Important Limitation

The current project uses Playwright locators and assertions. The
document describes a proposed recovery strategy; automatic locator
healing has not been implemented unless a dedicated fallback mechanism
is added and tested.

## 5. Example

Preferred locator:

`page.getByRole('button', { name: 'Generate Report' })`

Possible fallback:

`page.locator('button').filter({ hasText: 'Generate Report' })`

Before using the fallback, verify that it identifies exactly one
visible button and that clicking it performs the expected action.
