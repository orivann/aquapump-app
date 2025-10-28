output "cluster_endpoint" {
  description = "Endpoint for the EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "cluster_certificate_authority_data" {
  description = "Certificate data for cluster authentication"
  value       = module.eks.cluster_certificate_authority_data
}

output "acm_certificate_arn" {
  description = "ARN of the ACM certificate for the application domain"
  value       = module.acm.certificate_arn
}

output "route53_record_fqdn" {
  description = "Fully-qualified domain name of the application entrypoint"
  value       = module.route53.record_fqdn
}
