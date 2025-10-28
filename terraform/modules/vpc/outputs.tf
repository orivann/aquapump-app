output "vpc_id" {
  value       = aws_vpc.this.id
  description = "ID of the created VPC"
}

output "private_subnet_ids" {
  value       = [for subnet in aws_subnet.private : subnet.id]
  description = "Private subnet IDs"
}

output "public_subnet_ids" {
  value       = [for subnet in aws_subnet.public : subnet.id]
  description = "Public subnet IDs"
}

output "cluster_security_group_id" {
  value       = aws_security_group.cluster.id
  description = "Security group for the EKS cluster"
}
