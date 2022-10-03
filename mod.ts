export function orgCaptureUrlFactoryCore(captureType: string, options = {}) {
  const cap = new URL(`org-protocol://${captureType}`);
  cap.search = new URLSearchParams(options).toString();
  return cap;
}

export function orgCaptureUrlFactoryFactory(
  captureType: string,
  template: string,
  body: string,
  options = {}
) {
  return orgCaptureUrlFactoryCore(captureType, {
    template,
    body,
    ...options,
  });
}

export function orgCaptureUrlFactoryFactory(
  captureType: string,
  template: string,
  body: string,
  options = {}
) {
  return orgCaptureUrlFactoryCore(captureType, {
    template,
    body,
    ...options,
  });
}

export function orgCaptureHelper(template: string, body: string, options = {}) {
  return orgCaptureUrlFactoryFactory("story-link", template, body, options);
}

export function orgCaptureNonInteractive(
  template: string,
  body: string,
  options = {}
) {
  return orgCaptureUrlFactoryFactory("capture", template, body, options);
}

export function orgCaptureReadable(
  template: string,
  body: string,
  options = {}
) {
  return orgCaptureUrlFactoryFactory(
    "capture-eww-readble",
    template,
    body,
    options
  );
}

export function orgCaptureTodo(body: string) {
  orgCaptureNonInteractive("1", body);
}
export function orgCaptureTodoSync(body: string) {
  orgCaptureHelper("2", body);
}

export function orgCaptureNote(body: string) {
  orgCaptureNonInteractive("n", body);
}

export function orgCaptureDetailsInEmacs(body: string, options = {}) {
  orgCaptureHelper("fleshout", body, options);
}

export function mkOrgLink(link: string, name?: string) {
  if (name) {
    return `[[${link}][${name}]]`;
  }
  return `[[${link}]]`;
}
