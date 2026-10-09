Feature: JSONPlaceholder posts API

  Scenario: Create a post with valid data
    When I submit a valid post to the API
    Then the API should return a successful creation response

  Scenario: Submit a post with a missing user ID
    When I submit a post without a user ID
    Then I should record the API response for the missing user ID

  Scenario: Submit a post with an excessively long title
    When I submit a post with an excessively long title
    Then I should record the API response for the long title

  Scenario: Submit a post with special characters
    When I submit a post with special characters
    Then the API should return a response for the special characters
