variable "region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-central-1"
}

variable "instance_type" {
  description = "Instance type for the single-node k3s host"
  type        = string
  default     = "t3.large"
}

variable "key_name" {
  description = "Existing EC2 key pair for SSH access"
  type        = string
}

variable "ssh_cidr_blocks" {
  description = "CIDR blocks allowed to SSH into the host"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "subnet_id" {
  description = "Optional subnet ID to place the instance in (defaults to first subnet in the default VPC)"
  type        = string
  default     = ""
}

variable "root_volume_size" {
  description = "Root volume size in GiB"
  type        = number
  default     = 50
}

variable "metallb_address_pool" {
  description = "Address range for MetalLB (set to 'auto' to use the instance public IP)"
  type        = string
  default     = "auto"
}

variable "repository_branch" {
  description = "Branch of the Aquapump repository to deploy"
  type        = string
  default     = "main"
}

variable "argocd_namespace" {
  description = "Namespace used for Argo CD installation"
  type        = string
  default     = "argocd"
}
