output "cluster_role_arn" {
  value       = aws_iam_role.cluster.arn
  description = "IAM role ARN for the EKS control plane"
}

output "node_role_arn" {
  value       = aws_iam_role.node.arn
  description = "IAM role ARN for worker nodes"
}
