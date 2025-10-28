data "aws_security_group" "cluster" {
  id = var.security_group_id
}

resource "aws_security_group" "node_group" {
  name        = "${var.cluster_name}-node-sg"
  description = "Managed node group security group"
  vpc_id      = data.aws_security_group.cluster.vpc_id

  ingress {
    description = "Allow node to node communication"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  ingress {
    description      = "Allow control plane to communicate with nodes"
    from_port        = 1025
    to_port          = 65535
    protocol         = "tcp"
    security_groups  = [var.security_group_id]
  }

  ingress {
    description = "Allow public access to services"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  ingress {
    description = "Allow TLS access to services"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.cluster_name}-node-sg"
  })
}

resource "aws_security_group_rule" "cluster_inbound" {
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  security_group_id        = var.security_group_id
  source_security_group_id = aws_security_group.node_group.id
}

resource "aws_security_group_rule" "cluster_outbound" {
  type                     = "egress"
  from_port                = 1025
  to_port                  = 65535
  protocol                 = "tcp"
  security_group_id        = var.security_group_id
  source_security_group_id = aws_security_group.node_group.id
}

resource "aws_eks_cluster" "this" {
  name     = var.cluster_name
  role_arn = var.cluster_role_arn

  vpc_config {
    subnet_ids              = concat(var.subnet_ids, var.public_subnet_ids)
    security_group_ids      = [var.security_group_id]
    endpoint_public_access  = true
    endpoint_private_access = true
  }

  version = "1.29"

  tags = merge(var.tags, {
    Name = var.cluster_name
  })
}

resource "aws_eks_addon" "coredns" {
  cluster_name = aws_eks_cluster.this.name
  addon_name   = "coredns"
}

resource "aws_eks_addon" "kube_proxy" {
  cluster_name = aws_eks_cluster.this.name
  addon_name   = "kube-proxy"
}

resource "aws_eks_addon" "vpc_cni" {
  cluster_name = aws_eks_cluster.this.name
  addon_name   = "vpc-cni"
}

resource "aws_eks_node_group" "this" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "${var.cluster_name}-default"
  node_role_arn   = var.node_role_arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = var.node_group_desired_capacity
    max_size     = var.node_group_max_capacity
    min_size     = var.node_group_min_capacity
  }

  instance_types = ["t3.medium"]
  ami_type       = "AL2_x86_64"

  tags = merge(var.tags, {
    Name = "${var.cluster_name}-node-group"
  })
}

data "aws_eks_cluster" "this" {
  name = aws_eks_cluster.this.name
  depends_on = [aws_eks_cluster.this]
}

data "aws_eks_cluster_auth" "this" {
  name = aws_eks_cluster.this.name
}
