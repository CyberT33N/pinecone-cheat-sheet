# Login code issues

If the email token you received from Pinecone is not accepted when logging in there may be a few different reasons why:

## The code has expired

A code is only valid for 10 hours, so if you enter it after that time it will no longer be accepted.

## The code has already been used

If you're using a shared email account or distribution list, please check with your teammates to see if anyone else has used your code.

## A subsequent request was made

Similar to the first reason, if you're using a shared account, it's possible that someone else requested a code after you did, rendering the first code invalid.

## Your computer's system clock time is offset

User authentication with a verification code relies on your device’s system clock to verify the time. If your computer’s clock is more than 10 minutes off from your time zone, the login will fail. If you see the below error message, please set your system clock to the correct time and time zone before trying again.

```
Please check your computer's system clock time. See https://docs.pinecone.io/troubleshooting/login-code-issues for more information.
```

## Your anti-spam filter followed the links in the email to check their validity

If your anti-spam filter followed the links in the email to check their validity, and one of them submitted the code as part of the URL, please check with your anti-spam system admin or vendor to see if this might be the cause.
