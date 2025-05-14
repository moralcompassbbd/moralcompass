variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

variable "subnet_cidr_a" {
  description = "CIDR block for subnet A"
  default     = "10.0.1.0/24"
}

variable "subnet_cidr_b" {
  description = "CIDR block for subnet B"
  default     = "10.0.2.0/24"
}

variable "default_region" {
  description = "Default region"
  default     = "af-south-1"
}

variable "subnet_availability_zone_a" {
  description = "Availability zone for subnet A"
  default     = "af-south-1a"
}

variable "subnet_availability_zone_b" {
  description = "Availability zone for subnet B"
  default     = "af-south-1b"
}

variable "rds_db_username" {
  description = "Username for the PostgreSQL database"
  default     = "moralcompass"
}

variable "rds_db_password" {
  description = "Password for the PostgreSQL database"
  sensitive   = true
}

variable "rds_db_name" {
  description = "Name of the PostgreSQL database"
  default     = "mcdatabase"
}

variable "aws_account_id" {
  description = "The AWS Account ID"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "Google Client ID"
  type        = string
  default     = "534038687097-4ueh2o1b0d87ad38fpkgn3hi8mjeboga.apps.googleusercontent.com"
}

variable "google_token_url" {
  description = "Google Token Url"
  default     = "https://oauth2.googleapis.com/tokeninfo"
}

variable "port" {
  description = "Port for the application"
  type        = number
  default     = 3000
}

variable "admin_cache_ttl_ms" {
  description = "Cache TTL for admin data in milliseconds"
  type        = number
  default     = 60000
}
