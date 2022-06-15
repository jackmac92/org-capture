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
