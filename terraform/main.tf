locals {
  repo_url    = "https://github.com/orivann/aquapump.git"
  repo_branch = var.repository_branch

  tags = merge({
    Project   = "aquapump"
    Terraform = "true"
  }, var.additional_tags)
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnet_ids" "default" {
  vpc_id = data.aws_vpc.default.id
}

resource "aws_security_group" "aquapump" {
  name        = "aquapump-k3s"
  description = "Access for Aquapump k3s host"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.ssh_cidr_blocks
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.http_ingress_cidrs
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.https_ingress_cidrs
  }

  ingress {
    description = "LoadBalancer services"
    from_port   = 30000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = var.nodeport_ingress_cidrs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags, {
    Name = "aquapump-k3s"
  })
}

resource "aws_instance" "aquapump" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id != "" ? var.subnet_id : element(data.aws_subnet_ids.default.ids, 0)
  vpc_security_group_ids = [aws_security_group.aquapump.id]
  key_name               = var.key_name
  associate_public_ip_address = true
  monitoring                 = var.enable_detailed_monitoring
  ebs_optimized              = true

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
    encrypted   = var.root_volume_encrypted
    kms_key_id  = var.root_volume_kms_key_id != "" ? var.root_volume_kms_key_id : null
    delete_on_termination = var.ebs_delete_on_termination
  }

  user_data = templatefile("${path.module}/user_data.sh", {
    repo_url             = local.repo_url
    repo_branch          = local.repo_branch
    metallb_address_pool = var.metallb_address_pool
    argocd_namespace     = var.argocd_namespace
    helm_version         = var.helm_version
    metallb_version      = var.metallb_version
    ingress_chart_version = var.ingress_nginx_chart_version
    ingress_controller_version = var.ingress_nginx_controller_version
    argocd_version       = var.argocd_version
  })

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = var.metadata_hop_limit
  }

  iam_instance_profile = var.iam_instance_profile != "" ? var.iam_instance_profile : (
    var.enable_ssm && length(aws_iam_instance_profile.aquapump) > 0 ? aws_iam_instance_profile.aquapump[0].name : null
  )

  tags = merge(local.tags, {
    Name = "aquapump-k3s"
  })
}

resource "aws_iam_role" "aquapump" {
  count = var.enable_ssm && var.iam_instance_profile == "" ? 1 : 0

  name = "aquapump-k3s-ssm"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "aquapump_ssm" {
  count      = var.enable_ssm && var.iam_instance_profile == "" ? 1 : 0
  role       = aws_iam_role.aquapump[0].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "aquapump" {
  count = var.enable_ssm && var.iam_instance_profile == "" ? 1 : 0

  name = "aquapump-k3s-instance-profile"
  role = aws_iam_role.aquapump[0].name
}
