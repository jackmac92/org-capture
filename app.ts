export function orgCaptureUrlFactoryCore(captureType: string, options = {}) {
  const cap = new URL(`org-protocol://${captureType}`);
  cap.search = new URLSearchParams(options).toString();
  return cap;
}

export function orgCaptureUrlFactoryFactory(
  captureType: string,
  template: string,
  title: string,
  body: string,
  options = {}
) {
  return orgCaptureUrlFactoryCore(captureType, {
    template,
    body,
    title,
    ...options,
  });
}

function orgRoamRefCaptureHelper(
  template: string,
  title: string,
  body: string
) {
  orgCaptureUrlFactoryFactory("roam-ref", template, title, body, {
    ref: location.href,
  });
}

export function orgRoamRefCapture() {
  orgRoamRefCaptureHelper("r", document.title, window.getSelection());
}

export function orgCaptureHelper(
  template: string,
  title: string,
  body: string,
  options = {}
) {
  return orgCaptureUrlFactoryFactory(
    "story-link",
    template,
    title,
    body,
    options
  );
}

export function orgCaptureNonInteractive(
  template: string,
  title: string,
  body: string,
  options = {}
) {
  return orgCaptureUrlFactoryFactory("capture", template, title, body, options);
}

export function orgCaptureReadable(
  template: string,
  title: string,
  body: string,
  options = {}
) {
  return orgCaptureUrlFactoryFactory(
    "capture-eww-readble",
    template,
    title,
    body,
    options
  );
}

export function orgCaptureHtml() {
  let html = "";
  const sel = window.getSelection();
  if (sel.rangeCount) {
    const container = document.createElement("div");
    for (let i = 0, len = sel.rangeCount; i < len; ++i) {
      container.appendChild(sel.getRangeAt(i).cloneContents());
    }
    html = container.innerHTML;
  }
  // TODO prompt/wait for page cleanup
  const relToAbs = (href) => {
    const a = document.createElement("a");
    a.href = href;
    const abs = a.protocol + "//" + a.host + a.pathname + a.search + a.hash;
    a.remove();
    return abs;
  };
  const elementTypes = [
    ["a", "href"],
    ["img", "src"],
  ];
  const capturecontent = document.createElement("div");
  capturecontent.innerHTML = html;
  elementTypes.map((elementType) => {
    Array.from(capturecontent.getElementsByTagName(elementType[0])).forEach(
      (el, idx) => {
        el.setAttribute(
          elementType[idx],
          relToAbs(el.getAttribute(elementType[1]))
        );
      }
    );
  });
  const captureBody = capturecontent.innerHTML;
  orgCaptureUrlFactoryFactory(
    "capture-html",
    "w",
    document.title || "[untitled page]",
    // TODO captureBody seems to be ignored...
    captureBody,
    {
      url: location.href,
    }
  );
}

export function orgCaptureTodo(title: string, body: string) {
  orgCaptureNonInteractive("1", title, body);
}
export function orgCaptureTodoSync(title: string, body: string) {
  orgCaptureHelper("2", title, body);
}

export function orgCaptureNote(title: string, body: string) {
  orgCaptureNonInteractive("n", title, body);
}

export function orgCaptureDetailsInEmacs(
  title: string,
  body: string,
  options = {}
) {
  orgCaptureHelper("fleshout", title, body, options);
}
