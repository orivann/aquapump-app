output "record_fqdn" {
  value       = aws_route53_record.app.fqdn
  description = "Primary application FQDN"
}
