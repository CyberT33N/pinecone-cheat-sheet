# Node.js Troubleshooting

There could be several reasons why a [Node.js application](/reference/node-sdk) works in development mode but not in deployment.

In order to troubleshoot the issue, it's important to identify where the application is failing and compare the development and deployment environments to see what differences exist. It's also important to review any error messages or logs that are generated to help identify the issue.

You may also reach out to our [community of Pinecone users](https://community.pinecone.io) for help.

Here are a few aspects to troubleshoot:

## Dependency version mismatch

Sometimes, different environments have different versions of dependencies installed. If the application was developed using a specific version of a dependency, and that version is not installed on the deployment environment, the application may not work as expected.

## Environment configuration

The development environment may have different configurations from the deployment environment. For example, the development environment may have different environment variables set or different network settings. If the application relies on specific configuration settings that are not present in the deployment environment, it may not work.

## Permissions

The application may require permissions to access certain resources that are only granted in the development environment. For example, if the application needs to write to a specific directory, the permissions to write to that directory may only be granted in the development environment.

## Database connection

If the application relies on a database connection, it's possible that the connection settings are different in the deployment environment. For example, the database may have a different hostname or port number.

## Code optimization

During development, the application may have been running on a development server that did not optimize the code. However, when deployed, the application may be running on a production server that is optimized for performance. If there are code issues or performance bottlenecks, they may only appear when the application is deployed.

## Install fetch

It may be necessary to install the `fetch` Python library for compatibility with node.js.
