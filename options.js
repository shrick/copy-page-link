/*
*   Save user options to browser.storage
*/
const defaultFormat = 'markdown';
const defaultTimeout = '3000';
let message;

/*
*   Generic function for handling Promise objects
*/
function onError (error) {
  console.log(`Error: ${error}`);
}

/*
*   Set the message text to be displayed when options are saved. This function
*   is called when the platform message is received from the background script.
*/
function setMessage (platform) {
  switch (platform) {
    case 'mac':
      message = 'Preferences saved!';
      break;
    default:
      message = 'Options saved!';
      break;
  }
}

/*
*   Save user options in browser.storage
*/
function saveOptions(e) {
  e.preventDefault();

  // For use during development
  if (false) {
    let clearing = browser.storage.sync.clear();
    return;
  }

  let formats = document.getElementById('formats');
  let inputs = formats.getElementsByTagName('input');
  let selectedFormat = null;

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      selectedFormat = inputs[i].value;
      break;
    }
  }

  function notifyUser () {
    let status = document.getElementById('status');
    status.textContent = message;

    setTimeout(function () {
      status.textContent = '';
    }, 750);
    console.log(message);
  }

  if (selectedFormat) {
    let setting = browser.storage.sync.set({
      format: selectedFormat,
      auto: document.getElementById('auto').checked,
      msec: document.getElementById('msec').value,

      link: document.getElementById('link').value,
      href: document.getElementById('href').value,
      name: document.getElementById('name').value
    });
    setting.then(notifyUser, onError);
  }
}

/*
*   Restore HTML form values based on user options saved in browser.storage
*/
function restoreOptions() {

  function setPreferences (options) {
    document.getElementById(options.format || defaultFormat).checked = true;

    document.getElementById('auto').checked =
      (typeof options.auto === 'undefined') ? true : options.auto;

    document.getElementById('msec').value = options.msec || defaultTimeout;

    document.getElementById('link').value = options.link || 'link';
    document.getElementById('href').value = options.href || 'href';
    document.getElementById('name').value = options.name || 'name';

    console.log(options);
  }

  let getting = browser.storage.sync.get();
  getting.then(setPreferences, onError);
}

/*
*   Request platform info from background script via message
*/
function onGotBackgroundPage (page) {
  page.getPlatform();
}

let getting = browser.runtime.getBackgroundPage();
getting.then(onGotBackgroundPage, onError);

/*
*   Add runtime event listener for background script message
*/
browser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    setMessage(request);
  }
);

/*
*   Add event listeners for saving and restoring options
*/
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
