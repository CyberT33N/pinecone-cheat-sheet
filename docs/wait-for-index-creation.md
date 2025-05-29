# Wait for index creation to be complete

Pinecone index creation involves several different subsystems, including one which accepts the job of creating the index and one that actually performs the action. The Python SDK and the REST API are designed to interact with the first system during index creation but not the second.

This means that when a request call to [`create_index()`](/reference/api/2024-10/control-plane/create_index) is made, what's actually happening is that the job is being submitted to the queue to be completed. We do it this way for several reasons, including enforcing separation between the control and data planes.

If you need your application to wait for the index to be created before continuing to its next step, there is a way to ensure this happens, though. [`describe_index()`](/reference/api/2024-10/control-plane/describe_index) returns data about the state of the index, including whether it is ready to accept data. You simply call that method until it returns a 200 status code and the status object reports that the index is ready. Because the return is a tuple, we just have to access the slice containing the status object and check the boolean state of the ready variable. This is one possible method of doing so using the Python SDK:

```python
import pinecone
from time import sleep

def wait_on_index(index: str):
  """
  Takes the name of the index to wait for and blocks until it's available and ready.
  """
  ready = False
  while not ready:
    try:
      desc = pinecone.describe_index(index)
      if desc[7]['ready']:
        return True
    except pinecone.core.client.exceptions.NotFoundException:
      # NotFoundException means the index is created yet.
      pass
    sleep(5)
```

Calling `wait_on_index()` would then allow your application to only continue to upsert data once the index is fully online and available to accept data, avoiding potential 403 or 404 errors.
