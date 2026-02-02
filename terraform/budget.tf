resource "aws_budgets_budget" "cost_alert" {
  name              = "monthly-5-dollar-budget"
  budget_type       = "COST"
  limit_amount      = "5"
  limit_unit        = "USD"
  time_unit         = "MONTHLY"

  # Alert 1: You've actually spent 80% ($4.00)
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["kewinfdo22@gmail.com","kewinf271@gmail.com"] # REPLACE THIS
  }

  # Alert 2: AWS predicts you will hit 100% ($5.00)
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = ["kewinfdo22@gmail.com","kewinf271@gmail.com"] # REPLACE THIS
  }
}