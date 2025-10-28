variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "subnet_ids" {
  description = "Private subnet IDs for the cluster"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for load balancers"
  type        = list(string)
}

variable "cluster_role_arn" {
  description = "IAM role ARN for the EKS control plane"
  type        = string
}

variable "node_role_arn" {
  description = "IAM role ARN for the worker nodes"
  type        = string
}

variable "security_group_id" {
  description = "Security group ID for the cluster"
  type        = string
}

variable "node_group_desired_capacity" {
  description = "Desired number of worker nodes"
  type        = number
}

variable "node_group_min_capacity" {
  description = "Minimum number of worker nodes"
  type        = number
}

variable "node_group_max_capacity" {
  description = "Maximum number of worker nodes"
  type        = number
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed for worker node SSH and services"
  type        = list(string)
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
