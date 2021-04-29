const endpoint = "http://127.0.0.1:5000/event"

function sendEvent(eventName, data){
  return fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      event: eventName,
      data: data
    })
  })
}

function getDynamicSiblingIndex(el) {
  let sibCount = 0;
  let sibIndex = 0;
  let equivalentNode = false;
  for (let i = 0; i < el.parentNode.childNodes.length; i++) {
    const sib = el.parentNode.childNodes[i];
    if (sib.nodeName == el.nodeName) {
      if (sib === el) {
        sibIndex = sibCount;
      } else if (sib.tagName.toLowerCase() === el.tagName.toLowerCase()) {
        equivalentNode = true;
      }
      sibCount++;
    }
  }
  return [sibIndex, equivalentNode];
}

function getCSSSelector(el) {
  let ancestor = el;
  let selector = [];
  const numMatched = () => document.querySelectorAll(selector.join(" > ")).length
  do {
    let [siblingIdx, dynamic] = getDynamicSiblingIndex(ancestor);
    let nthOfType = `:nth-of-type(${siblingIdx + 1})`
    selector.unshift(`${ancestor.tagName.toLowerCase()}${dynamic ? nthOfType : ''}`);
    if (numMatched() === 1) break;
    ancestor = ancestor.parentElement;
  } while (ancestor)
  return selector.join(" > ");
}

function isVisible(elem) {
  return elem.offsetParent !== null && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length); // inspired by jquery :)
}

function getInputElementValue(element) {
    // In the wild, we've seen examples of input elements with `contenteditable=true`,
    // but an `input` never has inner text, so we check for `input` tag name here.
    if (element.isContentEditable && element.tagName.toLowerCase() !== 'input') {
        return element.innerText;
    }

    return element.value;
}

document.addEventListener("click", (event) => {
  sendEvent("click", {
      selector: getCSSSelector(event.target)
  }).then(() => {
      console.log("Recorded click")
  })
})

document.addEventListener("change", (event) => {
  sendEvent("change", {
      selector: getCSSSelector(event.target),
      value: getInputElementValue(event.target)
  }).then(() => {
      console.log("Recorded change")
  })
})
