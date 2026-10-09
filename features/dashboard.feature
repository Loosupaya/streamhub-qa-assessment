Feature: Streamhub campaign analytics dashboard

  Scenario: Display campaign summary and performance chart
    Given I open the Streamhub dashboard
    Then I should see the campaign summary metrics
    And I should see the campaign performance chart with visible bars

  Scenario: Calculate campaign click-through rate
    Given I open the Streamhub dashboard
    When I generate a report for campaign "Summer Launch" with 2000 impressions and 50 clicks
    Then the report should show campaign "Summer Launch"
    And the calculated click-through rate should be "2.50%"

  Scenario: Reject clicks greater than impressions
    Given I open the Streamhub dashboard
    When I generate a report for campaign "Invalid Campaign" with 100 impressions and 150 clicks
    Then I should see a validation error
