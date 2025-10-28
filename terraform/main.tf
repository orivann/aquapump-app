locals {
  common_tags = merge(
    {
      Environment = terraform.workspace
    },
    var.tags
  )
}

module "vpc" {
  source               = "./modules/vpc"
  name                 = "${var.cluster_name}-vpc"
  region               = var.aws_region
  cidr_block           = "10.10.0.0/16"
  private_subnet_cidrs = var.private_subnet_cidrs
  public_subnet_cidrs  = var.public_subnet_cidrs
  tags                 = local.common_tags
}

module "iam" {
  source       = "./modules/iam"
  cluster_name = var.cluster_name
  tags         = local.common_tags
}

module "eks" {
  source                      = "./modules/eks"
  cluster_name                = var.cluster_name
  region                      = var.aws_region
  subnet_ids                  = module.vpc.private_subnet_ids
  public_subnet_ids           = module.vpc.public_subnet_ids
  cluster_role_arn            = module.iam.cluster_role_arn
  node_role_arn               = module.iam.node_role_arn
  security_group_id           = module.vpc.cluster_security_group_id
  node_group_desired_capacity = 2
  node_group_max_capacity     = 4
  node_group_min_capacity     = 1
  allowed_cidr_blocks         = var.allowed_cidr_blocks
  tags                        = local.common_tags
}

module "acm" {
  source      = "./modules/acm"
  domain_name = var.domain_name
  zone_id     = var.hosted_zone_id
  tags        = local.common_tags
}

module "route53" {
  source        = "./modules/route53"
  domain_name   = var.domain_name
  hosted_zone_id = var.hosted_zone_id
  alb_dns_name  = var.alb_dns_name
  alb_zone_id   = var.alb_zone_id
  tags          = local.common_tags
}
