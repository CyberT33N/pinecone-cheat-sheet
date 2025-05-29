# Terraform

Terraform is an infrastructure as code tool that lets you create, update, and version infrastructure by defining resources in configuration files. This allows for a repeated workflow for provisioning and managing your infrastructure.

## Setup guide

This page shows you how to use the [Terraform Provider for Pinecone](https://registry.terraform.io/providers/pinecone-io/pinecone/latest/docs) to manage Pinecone indexes and collections.

### Requirements

Ensure you have the following:

* [Terraform](https://developer.hashicorp.com/terraform) >= v1.4.6
* [Go](https://go.dev/doc/install) >= v1.23.7
* A [Pinecone API key](https://app.pinecone.io/organizations/-/keys)

### Installation

The provider is registered in the official [Terraform registry](https://registry.terraform.io/providers/pinecone-io/pinecone/latest).
This enables the provider to be auto-installed when you run `terraform init`. You can also download the latest binary for your target platform from the [**Releases**](https://github.com/pinecone-io/terraform-provider-pinecone/releases) tab.

### Enable the provider

To enable the provider in your Terraform configuration, set a `PINECONE_API_KEY` environment variable to your Pinecone API key and add the following to your Terraform configuration file:

```hcl
terraform { 
  required_providers { 
    pinecone = { 
      source = "pinecone-io/pinecone" 
    } 
  } 
} 

provider "pinecone" {}
```

If your API key was set as an [input variable](https://developer.hashicorp.com/terraform/language/values/variables), you can use that value in the declaration, for example:

```hcl
provider "pinecone" {
  api_key = var.pinecone_api_key
}
```

### Resources

The Pinecone Terraform Provider currently supports index and collection resources.

#### Indexes

The `pinecone_index` resource lets you create, delete, and update [indexes](/guides/index-data/indexing-overview).

```hcl
// Create a dense index
resource "pinecone_index" "dense-index-tf" {
  name       = "tf-dense-index"
  dimension  = 1536
  metric     = "cosine"
  spec       = {
    serverless = {
      cloud  = "aws"
      region = "us-west-2"
    }
  }
  deletion_protection = "disabled"
  tags = {
    environment = "development"
  }
}

// Create a sparse index
resource "pinecone_index" "sparse-index-tf" {
  name      = "tf-sparse-index"
  dimension = 10
  metric = "dotproduct"
  vector_type = "sparse"
  spec = {
    serverless = {
      cloud  = "aws"
      region = "us-west-2"
    }
  }
  deletion_protection = "disabled"
  tags = {
    environment = "development"
  }
}

// Create a dense index with integrated embedding
resource "pinecone_index" "dense-index-integrated" {
  name      = "tf-dense-index-with-integrated-embedding"
  spec = {
    serverless = {
      cloud  = "aws"
      region = "us-west-2"
    }
  }
  embed = {
    model = "llama-text-embed-v2"
    field_map = {
      text = "chunk_text"
    }
  }
}
```

#### Collections

The `pinecone_collection` resource lets you create, delete, and update [collections](/guides/indexes/pods/understanding-collections) for pod-based indexes.

```
resource "pinecone_index" "test" {
  name      = "tf-test-index"
  dimension = 10
  spec = {
    pod = {
      environment = "us-west4-gcp"
      pod_type    = "s1.x1"
    }
  }
}

resource "pinecone_collection" "example-collection" {
  name   = "tf-example-collection"
  source = pinecone_index.test.name
```

## Limitations

The Terraform Provider for Pinecone does not currently support the following resources:

* [Backups for serverless indexes](/guides/manage-data/backups-overview)
* [Projects](/guides/projects/understanding-projects)
* [API keys](/guides/projects/manage-api-keys)
* [Service accounts](/guides/projects/manage-service-accounts)
* [Private endpoints](/guides/production/connect-to-aws-privatelink)
* [Assistants](/guides/assistant/overview)

## Additional resources

* Documentation can be found on the [Terraform
  Registry](https://registry.terraform.io/providers/pinecone-io/pinecone/latest/docs).
* See the [GitHub respository](https://github.com/pinecone-io/terraform-provider-pinecone/tree/main/examples)
  for additional usage examples.
* For support requests, create an issue in the [GitHub
  repository](https://github.com/pinecone-io/terraform-provider-pinecone).
