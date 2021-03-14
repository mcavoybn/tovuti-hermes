
async function getComments(articleId) {
    try {
        // @TODO need to move url to env vars
        var result = await fetch('http://localhost:5000/api/comments/' + articleId, {method: 'GET'});
        return await result.json();
    } catch (err) {
        console.error('error getting comments : ');
        console.error(err);
        return err;
    }
}

async function postComment(comment) {
    try {
        // @TODO need to move url to env vars
        var result = await postData('http://localhost:5000/api/comments', comment);
        return result;
    } catch (err) {
        console.error('error getting comments : ');
        console.error(err);
        return err;
    }
}

async function getTovutiUserById(id) {
    // @TODO figure out how to get this to work on any instance
    try {
        var result = await fetch('https://ben.zenfullyeasy.com/api/v1/users/' + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                // @TODO move these keys to env vars
                'x-public-key': 'api_pk_5ABFEF98D50547EDA840AE4C3DF16F18',
                'x-api-key': 'api_sk_5DD8B46DC3084D6B87E2FCF2AA81330C'
            }
        });
        return result.json();
    } catch (err) {
        console.error('error getting user : ');
        console.error(err);
        return err;
    }
}

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

export default {
    postComment,
    getComments,
    getTovutiUserById
};