variable "domain_name" {
  description = "Domain name to map to the application"
  type        = string
}

variable "hosted_zone_id" {
  description = "Hosted zone ID for the domain"
  type        = string
}

variable "alb_dns_name" {
  description = "DNS name of the ingress load balancer"
  type        = string
}

variable "alb_zone_id" {
  description = "Zone ID of the ingress load balancer"
  type        = string
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
