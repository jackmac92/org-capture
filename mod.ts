export function orgCaptureUrlFactoryCore(captureType: string, options = {}) {
  const cap = new URL(`org-protocol://${captureType}`);
  options["from-deno-json"] = 1;
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

export function parseOrgLink(s: string) {
  const maybeMatches = s.match(/\[\[(\S+)\]\[([\w\s]+)\]\]/);
  if (maybeMatches === null) {
    return [,];
  }
  return [maybeMatches.at(1), maybeMatches.at(2)];
}

export function validateOrgLink(s: string): boolean {
  const [link, title] = parseOrgLink(s);

  if (!link) {
    return false;
  }
  try {
    new URL(link);
  } catch {
    return false;
  }
  if (title === undefined) {
    return true;
  }

  return title.length > 0 && !isOrgLink(title);
}

export function isOrgLink(s: string): boolean {
  return s.startsWith("[[[[") && s.endsWith("]]]]");
}

export function mkOrgLink(link: string, name?: string) {
  if (isOrgLink(link)) {
    return link;
  }

  if (name) {
    return `[[${link}[[${link}][][${name}]]]]`;
  }
  return `[[${link}[[${link}][]]]]`;
}

export function strictMkOrgLink(link: string, name: string) {
  if (isOrgLink(link)) {
    return link;
  }
  new URL(link);
  return `[[${link}[[${link}][][${name}]]]]`;
}
