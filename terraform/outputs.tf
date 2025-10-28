output "instance_id" {
  description = "ID of the EC2 instance running k3s"
  value       = aws_instance.aquapump.id
}

output "public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.aquapump.public_ip
}

output "ssh_command" {
  description = "SSH command to connect to the node"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_instance.aquapump.public_ip}"
}

output "security_group_id" {
  description = "Security group protecting the k3s node"
  value       = aws_security_group.aquapump.id
}

output "iam_instance_profile" {
  description = "IAM instance profile attached to the node"
  value       = var.iam_instance_profile != "" ? var.iam_instance_profile : (var.enable_ssm && length(aws_iam_instance_profile.aquapump) > 0 ? aws_iam_instance_profile.aquapump[0].name : "")
}
