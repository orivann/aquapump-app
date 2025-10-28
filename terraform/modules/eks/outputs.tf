output "cluster_name" {
  value       = aws_eks_cluster.this.name
  description = "EKS cluster name"
}

output "cluster_endpoint" {
  value       = data.aws_eks_cluster.this.endpoint
  description = "EKS cluster API endpoint"
}

output "cluster_certificate_authority_data" {
  value       = data.aws_eks_cluster.this.certificate_authority[0].data
  description = "Certificate authority data"
}

output "cluster_token" {
  value       = data.aws_eks_cluster_auth.this.token
  description = "Authentication token for the Kubernetes provider"
}

output "node_security_group_id" {
  value       = aws_security_group.node_group.id
  description = "Security group ID for worker nodes"
}
