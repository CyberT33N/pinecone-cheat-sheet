# Error: Handshake read failed when connecting

## Problem

When trying to connect to Pinecone server, some users may receive an error message that says `Handshake read failed` and their connection attempt fails. This error can prevent them from running queries against their Pinecone indexes.

## Solution

If you encounter this error message, it means that your computer is not properly connecting with the Pinecone server. The error is often due to a misconfiguration of your Pinecone client or API key. Here is a recommended solution:

1. Make sure your firewall is not blocking any traffic and your internet connection is working fine. If you are unsure about how to do this, please consult your IT team.
2. Check that you have set up the Pinecone client and API key correctly. Double-check that you have followed the instructions in our [documentation](/guides/get-started/quickstart) correctly.
3. If you are still having issues, try creating a new index on Pinecone and populating it with data by running another script on your computer. This will verify that your computer can access the Pinecone servers for some tasks.
4. If the error persists, you may need to check your code for any misconfigurations. Make sure you are setting up your Pinecone client correctly and passing the right parameters when running queries against your indexes.
5. If you are still unable to resolve the issue, you can reach out to Pinecone support for assistance. They will be able to help you diagnose and resolve the issue.

## Conclusion

If you encounter the `Handshake read failed` error when trying to connect to Pinecone server, there are several steps you can take to resolve the issue. First, double-check that you have set up the Pinecone client and API key correctly. Then, check for any misconfigurations in your code. If the error persists, [contact Pinecone Support](/troubleshooting/contact-support) for assistance.
