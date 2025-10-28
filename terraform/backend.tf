terraform {
  backend "s3" {
    bucket         = "aquapump-terraform-state"
    key            = "global/s3/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "aquapump-terraform-lock"
    encrypt        = true
  }
}
