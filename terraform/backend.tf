terraform {
  backend "s3" {
    bucket  = "moral-compass-terraform-state"
    key     = "terraform.tfstate"
    region  = "af-south-1"
    encrypt = true
    acl     = "bucket-owner-full-control"
  }
}
