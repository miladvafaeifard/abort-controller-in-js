# AbortController

The AbortController interface represents a controller object that allows you to abort one or more Web requests as and when desired.

You can create a new AbortController object using the AbortController() constructor. Communicating with a DOM request is done using an AbortSignal object.

## Examples

```js
const controller = new AbortController();

async function fetchVideo() {
  const response = await fetch(url, { signal });
} 

function abortDownloading() {
  controller.abort();
}

```