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
