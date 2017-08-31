"use strict";
/* globals Mousetrap, scrollToTweet, hidePromotedTweets, elementReady */
const $ = document.querySelector.bind(document);

function registerShortcuts(username) {
  Mousetrap.bind("n", () => {
    if (window.location.pathname.split("/")[1] === "messages") {
      $('a[href$="/messages/compose"]').click();
    } else {
      $('a[href$="/compose/tweet"]').click();
    }

    return false;
  });

  Mousetrap.bind("g h", () => {
    $('a[href$="/home"]').click();
  });

  Mousetrap.bind("g n", () => {
    $('a[href$="/notifications"]').click();
  });

  Mousetrap.bind("g m", () => {
    $('a[href$="/messages"]').click();
  });

  Mousetrap.bind("g p", () => {
    $('a[href$="/account"]').click();
    $(`a[href$="/${username}"]`).click();
  });

  Mousetrap.bind("g l", () => {
    $('a[href$="/account"]').click();
    $(`a[href$="/${username}"]`).click();
    $(`a[href$="/${username}/likes"]`).click();
  });

  Mousetrap.bind("g i", () => {
    $('a[href$="/account"]').click();
    $(`a[href$="/${username}/lists"]`).click();
  });
  /*
  Mousetrap.bind("d", () => {
    toggleDarkMode();
  });

  Mousetrap.bindGlobal("esc", () => {
    const btn = $("button._158OzO7l");

    if (btn) {
      btn.click();
    }
  });

  Mousetrap.bindGlobal("command+enter", () => {
    if (window.location.pathname === "/compose/tweet") {
      $("button._1LQ_VFHl._2cmVIBgK").click();
    }

    if (window.location.pathname.split("/")[1] === "messages") {
      $('button[data-testid="dmComposerSendButton"]').click();
    }
  });

  Mousetrap.bind("right", () => {
    const nextBtn = $("button._2p6iBzFu._2UbkmNPH");

    if (nextBtn) {
      nextBtn.click();
    }
  });

  Mousetrap.bind("left", () => {
    const prevBtn = $("button._2p6iBzFu.lYVIpMQ4");

    if (prevBtn) {
      prevBtn.click();
    }
  });
*/
  // vim bindings
  const pageScrollPctHeight = 0.9;
  const fromScrollTop = n => document.body.scrollTop + n;
  const scrollToY = y => window.scrollTo(0, y);

  Mousetrap.bind("j", scrollToTweet);
  Mousetrap.bind("k", scrollToTweet);

  Mousetrap.bind("g g", () => {
    scrollToY(0);
  });

  Mousetrap.bind("ctrl+d", () => {
    scrollToY(fromScrollTop(window.innerHeight * pageScrollPctHeight));
  });

  Mousetrap.bind("ctrl+u", () => {
    scrollToY(fromScrollTop(window.innerHeight * -pageScrollPctHeight));
  });

  Mousetrap.bind("G", () => {
    scrollToY(document.body.scrollHeight);
  });
  // -- //
}

function getMode() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ method: "getMode" }, res => {
      //Avoids failing reference when false
      if (res === undefined) {
        resolve(false);
      } else {
        // values are being passed back as strings, this converts to accurate boolean
        resolve(res.darkMode === "true");
      }
    });
  });
}

function setMode(newMode) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      {
        method: "setMode",
        darkMode: newMode
      },
      res => {
        // values are being passed back as strings, this converts to accurate boolean
        resolve(res.darkMode === "true");
      }
    );
  });
}

function toggleDarkMode() {
  getMode()
    .then(current => {
      setMode(!current);
    })
    .then(applyMode());
}

function applyMode(isDark) {
  document.documentElement.classList.toggle("dark-mode", isDark);
}

function init() {
  // apply dark mode with local storage value
  getMode().then(applyMode);
}

document.addEventListener("DOMContentLoaded", () => {
  // detect when React is ready before firing init
  init();

  hidePromotedTweets(elementReady);
});
