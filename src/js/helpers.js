// goal of this file is to keep functions that we re-use over and over in project.
import { TIMEOUT_SEC } from './config.js';
const timeout = function (s) {
  // this function will create new promise and rejected after time that is declared.
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/* getJSON & sendJSON methods belove putting together in one function*/
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //we race fetch() and timeout() in that case we are stopping users with slow internet connection to load data forever
    const data = await res.json();
    if (!res.ok)
      throw new Error(`${data.message} ${res.statusText} (${res.status})`);
    return data; // this data will become resolved value of this promise, that's why we await this promise in model.js and store it in data variable.
  } catch (err) {
    throw err; //throwing err -> on this way we are handling error in the function where is getJSON() used.
  }
};
/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //we race fetch() and timeout() in that case we are stopping users with slow internet connection to load data forever
    const data = await res.json();
    if (!res.ok)
      throw new Error(`${data.message} ${res.statusText} (${res.status})`);
    return data; // this data will become resolved value of this promise, that's why we await this promise in model.js and store it in data variable.
  } catch (err) {
    throw err; //throwing err -> on this way we are handling error in the function where is getJSON() used.
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok)
      throw new Error(`${data.message} ${res.statusText} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
