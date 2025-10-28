variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "eu-central-1"
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "aquapump"
}

variable "domain_name" {
  description = "Primary domain name for the application"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}

variable "alb_dns_name" {
  description = "DNS name of the public load balancer fronting the cluster"
  type        = string
}

variable "alb_zone_id" {
  description = "Route53 zone ID associated with the load balancer"
  type        = string
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.10.0.0/19", "10.10.32.0/19"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.10.64.0/20", "10.10.80.0/20"]
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access public services"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "tags" {
  description = "Common tags applied to resources"
  type        = map(string)
  default = {
    Project = "aquapump"
  }
}
