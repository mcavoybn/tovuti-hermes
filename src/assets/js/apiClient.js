
/**
 * Retrieves all the comments for a given articleId
 * 
 * @param {string|int} articleId 
 */
async function getComments(articleId) {
    try {
        // @TODO need to move root domain url to env vars
        var result = await fetch('http://localhost:5000/api/comments/' + articleId, {method: 'GET'});
        return await result.json();
    } catch (err) {
        console.error('error getting comments : ');
        console.error(err);
        return err;
    }
}

/**
 * Retrieves all the comments for a given articleId
 * 
 * @param {string|int} articleId  The id of the thing the comment is for
 * @param {object} commentData  The comment object
 */
async function postComment(articleId, commentData) {
    try {
        // @TODO need to move root domain url to env vars
        var result = await postData('http://localhost:5000/api/comments/' + articleId, commentData);
        return result.json();
    } catch (err) {
        console.error('error getting comments : ');
        console.error(err);
        return err;
    }
}

/**
 * Upvotes or downvotes a comment
 * 
 * @param {string|int} articleId  The id of the thing the comment is for
 * @param {string} commentId  The id of the comment
 * @param {string|int|boolean} upOrDown
 */
async function rateComment(articleId, commentId, upOrDown) {
    upOrDown = upOrDown ? "up" : "down";
    try {
        // @TODO need to move root domain url to env vars
        const url = 'http://localhost:5000/api/comments/upvote/' + articleId + "/" + commentId + "/" + upOrDown
        const commentData = {
            foo: 'bar'
        };
        var result = await postData(url, commentData);
        return result.json();
    } catch (err) {
        console.error('error getting comments : ');
        console.error(err);
        return err;
    }
}

/**
 * Retrieves the user database row (joom_user) with the given id
 * 
 * @param {string|int} id  The id of the thing the user we want information for
 */
async function getTovutiUserById(id) {
    // @TODO add domain env var and figure out how to get public key
    // and api key for client instances
    try {
        var result = await fetch('https://ben.zenfullyeasy.com/api/v1/users/' + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-public-key': 'api_pk_5ABFEF98D50547EDA840AE4C3DF16F18',
                'x-api-key': 'api_sk_5DD8B46DC3084D6B87E2FCF2AA81330C'
            }
        });
        return result;
    } catch (err) {
        console.error('error getting user : ');
        console.error(err);
        return err;
    }
}

export default {
    postComment,
    getComments,
    rateComment,
    getTovutiUserById,
};


// ------ Helper Functions --------

/**
 * Used for posting data with all the nicest headers
 * 
 * APIs are sometimes fickle about header data, so this is nice for that
 * 
 * Taken from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * 
 * @param {string} url  The url we want to post data to
 * @param {object} data  The data we want to send to the endpoint
 */
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