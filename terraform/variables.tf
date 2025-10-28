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

variable "http_ingress_cidrs" {
  description = "CIDR blocks allowed to reach HTTP services on the node"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "https_ingress_cidrs" {
  description = "CIDR blocks allowed to reach HTTPS services on the node"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "nodeport_ingress_cidrs" {
  description = "CIDR blocks allowed to reach NodePort services exposed by MetalLB"
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

variable "additional_tags" {
  description = "Additional AWS resource tags to apply"
  type        = map(string)
  default     = {}
}

variable "enable_ssm" {
  description = "Create an instance profile with SSM permissions for the node"
  type        = bool
  default     = true
}

variable "iam_instance_profile" {
  description = "Existing IAM instance profile to associate with the node (overrides the automatically created profile)"
  type        = string
  default     = ""
}

variable "helm_version" {
  description = "Version of Helm to install on the bootstrap host"
  type        = string
  default     = "v3.14.4"
}

variable "metallb_version" {
  description = "Version of MetalLB manifests to install"
  type        = string
  default     = "v0.14.5"
}

variable "ingress_nginx_chart_version" {
  description = "Helm chart version for ingress-nginx"
  type        = string
  default     = "4.11.2"
}

variable "ingress_nginx_controller_version" {
  description = "Ingress-NGINX controller image tag"
  type        = string
  default     = "1.11.1"
}

variable "argocd_version" {
  description = "Version of Argo CD to install"
  type        = string
  default     = "v2.10.8"
}

variable "root_volume_encrypted" {
  description = "Whether to encrypt the root volume"
  type        = bool
  default     = true
}

variable "root_volume_kms_key_id" {
  description = "Optional KMS key ID for root volume encryption"
  type        = string
  default     = ""
}

variable "ebs_delete_on_termination" {
  description = "Whether to delete the root EBS volume when the instance is terminated"
  type        = bool
  default     = true
}

variable "enable_detailed_monitoring" {
  description = "Enable detailed CloudWatch monitoring for the EC2 instance"
  type        = bool
  default     = true
}

variable "metadata_hop_limit" {
  description = "Maximum number of network hops for metadata requests"
  type        = number
  default     = 2
}
