# Restrictions on index names

There are two main restrictions on index names in Pinecone: **character restrictions** and a **maximum length**.

## Character restrictions

Index names can only use UTF-8 lowercase alphanumeric Latin characters and dashes. Non-Latin characters (such as Chinese or Cyrillic) and emojis are not supported. Additionally, they cannot contain dots, as these are used to separate hosts and subnets in DNS, which Pinecone uses to route requests and queries.

## Maximum length

The maximum length of your index name is a factor of limits imposed by the infrastructure Pinecone uses behind the scenes. The combination of your index name and project ID (normally a seven-character, alphanumeric string) cannot exceed 52 characters, plus a dash to separate them. Your project ID is different from your project name, which is often longer than seven characters. You can identify your project ID by the hostname used to connect to your index; it's the last set of characters after the final `-`. For example, if your index is `foo` and your project ID is `abc1234` in the `us-east1-gcp` environment, your index's hostname would be `foo-abc1234.svc.us-east1-gcp.pinecone.io`, and its length would be 11 characters (3 for the index name, 1 for the dash, 7 for the project ID).
