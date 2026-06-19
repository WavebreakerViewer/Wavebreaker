(function () {
  const params = new URLSearchParams(window.location.search);
  const queryData = {
    version: params.get("version") || "",
    channel: params.get("channel") || "",
    grid: params.get("grid") || "",
    os: params.get("os") || ""
  };
  const gridStatusState = {
    status: "Online",
    inWorld: "34,829",
    source: "",
    refreshSeconds: 300
  };
  const latestVersionState = {
    text: "7.2.4 (80712)",
    source: "",
    branch: "display",
    grid: "sl",
    platform: "win",
    variant: "regular",
    refreshSeconds: 3600
  };
  const statusUpdatesState = {
    lines: [
      "Phone and Live Chat Support Maintenance",
      "Unscheduled Name Change Maintenance",
      "Rolling Restarts for Second Life RC Channels"
    ],
    source: "",
    limit: 3,
    refreshSeconds: 600
  };
  const splashSettings = ["hidetopbar", "hideblogs", "hidedestinations", "usegraymode", "usehighcontrast", "useallcaps", "uselargerfonts", "notransparency"];

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  function getSecondLifeTime() {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(new Date());
  }

  function getPanelData(key) {
    if (key === "latest_version") {
      return latestVersionState.text;
    }

    if (key === "grid_status") {
      return `Currently: ${gridStatusState.status}`;
    }

    if (key === "grid_in_world") {
      const configured = window.WAVEBREAKER_GRID_IN_WORLD || "";
      return `In-World: ${configured || gridStatusState.inWorld}`;
    }

    if (key === "sl_time") {
      return `SL Time: ${getSecondLifeTime()}`;
    }

    if (key === "status_updates") {
      return "";
    }

    return queryData[key] || "";
  }

  function getPanelParts(key) {
    if (key === "grid_status") {
      return { label: "Currently:", value: gridStatusState.status };
    }

    if (key === "grid_in_world") {
      const configured = window.WAVEBREAKER_GRID_IN_WORLD || "";
      return { label: "In-World:", value: configured || gridStatusState.inWorld };
    }

    if (key === "sl_time") {
      return { label: "SL Time:", value: getSecondLifeTime() };
    }

    return null;
  }

  function setPanelContent(node, key) {
    const parts = getPanelParts(key);
    if (!parts) {
      node.textContent = getPanelData(key);
      return;
    }

    const label = document.createElement("span");
    label.className = "panel-label";
    label.textContent = parts.label;
    const value = document.createElement("span");
    value.className = "panel-value";
    value.textContent = ` ${parts.value}`;
    node.replaceChildren(label, value);
  }

  function refreshPanelKey(key) {
    document.querySelectorAll(`[data-panel-key="${key}"]`).forEach((node) => {
      setPanelContent(node, key);
    });
  }

  function refreshSecondLifeTime() {
    refreshPanelKey("sl_time");
  }

  function startSecondLifeClock() {
    refreshSecondLifeTime();
    const now = new Date();
    const delay = Math.max(1000, (60 - now.getSeconds()) * 1000 - now.getMilliseconds());
    setTimeout(() => {
      refreshSecondLifeTime();
      setInterval(refreshSecondLifeTime, 60000);
    }, delay);
  }

  function configureGridStatus(config) {
    const gridStatus = config.querySelector("gridStatus");
    if (!gridStatus) {
      return;
    }

    gridStatusState.source = attr(gridStatus, "source");
    gridStatusState.status = attr(gridStatus, "fallbackStatus", gridStatusState.status);
    gridStatusState.inWorld = attr(gridStatus, "fallbackInWorld", gridStatusState.inWorld);
    gridStatusState.refreshSeconds = Math.max(60, Number(attr(gridStatus, "refreshSeconds", "300")) || 300);
  }

  function configureLatestVersion(config) {
    const latestVersion = config.querySelector("latestVersion");
    if (!latestVersion) {
      return;
    }

    latestVersionState.source = attr(latestVersion, "source");
    latestVersionState.branch = attr(latestVersion, "branch", latestVersionState.branch);
    latestVersionState.grid = attr(latestVersion, "grid", latestVersionState.grid);
    latestVersionState.platform = attr(latestVersion, "platform", latestVersionState.platform);
    latestVersionState.variant = attr(latestVersion, "variant", latestVersionState.variant);
    latestVersionState.text = attr(latestVersion, "fallback", latestVersionState.text);
    latestVersionState.refreshSeconds = Math.max(300, Number(attr(latestVersion, "refreshSeconds", "3600")) || 3600);
  }

  function configureStatusUpdates(config) {
    const statusUpdates = config.querySelector("statusUpdates");
    if (!statusUpdates) {
      return;
    }

    statusUpdatesState.source = attr(statusUpdates, "source");
    statusUpdatesState.limit = Math.max(1, Number(attr(statusUpdates, "limit", "3")) || 3);
    statusUpdatesState.refreshSeconds = Math.max(120, Number(attr(statusUpdates, "refreshSeconds", "600")) || 600);
  }

  function normalizeStatus(status) {
    if (!status) {
      return gridStatusState.status;
    }

    const lower = status.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  async function refreshGridStatus() {
    if (!gridStatusState.source) {
      return;
    }

    try {
      const response = await fetch(gridStatusState.source, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const body = await response.text();
      const stats = new DOMParser().parseFromString(body, "application/xml").querySelector("stats");
      if (!stats) {
        throw new Error("Missing stats node");
      }

      gridStatusState.status = normalizeStatus(text(stats.querySelector("status"), gridStatusState.status));
      gridStatusState.inWorld = text(stats.querySelector("inworld"), gridStatusState.inWorld);
      refreshPanelKey("grid_status");
      refreshPanelKey("grid_in_world");
    } catch (error) {
      refreshPanelKey("grid_status");
      refreshPanelKey("grid_in_world");
    }
  }

  function startGridStatus() {
    refreshPanelKey("grid_status");
    refreshPanelKey("grid_in_world");
    refreshGridStatus();
    setInterval(refreshGridStatus, gridStatusState.refreshSeconds * 1000);
  }

  function readLatestVersion(data) {
    const item = data?.standardized?.[latestVersionState.branch]?.[latestVersionState.grid]?.[latestVersionState.platform]?.[latestVersionState.variant];
    if (!item || !item.viewer_version || !item.build_number) {
      return "";
    }

    return `${item.viewer_version} (${item.build_number})`;
  }

  async function refreshLatestVersion() {
    if (!latestVersionState.source) {
      return;
    }

    try {
      const response = await fetch(latestVersionState.source, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const latestText = readLatestVersion(await response.json());
      if (latestText) {
        latestVersionState.text = latestText;
      }
      refreshPanelKey("latest_version");
    } catch (error) {
      refreshPanelKey("latest_version");
    }
  }

  function startLatestVersion() {
    refreshPanelKey("latest_version");
    refreshLatestVersion();
    setInterval(refreshLatestVersion, latestVersionState.refreshSeconds * 1000);
  }

  function refreshStatusUpdatesPanel() {
    document.querySelectorAll('[data-panel-key="status_updates"]').forEach((node) => {
      node.replaceChildren(...statusUpdatesState.lines.slice(0, statusUpdatesState.limit).map((line) => {
        const item = document.createElement("span");
        item.className = "status-update-line";
        item.textContent = line;
        return item;
      }));
    });
  }

  async function refreshStatusUpdates() {
    if (!statusUpdatesState.source) {
      refreshStatusUpdatesPanel();
      return;
    }

    try {
      const response = await fetch(statusUpdatesState.source, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const body = await response.text();
      const feedDocument = new DOMParser().parseFromString(body, "application/xml");
      const items = parseFeedItems(feedDocument, statusUpdatesState.limit).map((item) => item.title);
      if (items.length) {
        statusUpdatesState.lines = items;
      }
    } catch (error) {
    }

    refreshStatusUpdatesPanel();
  }

  function startStatusUpdates() {
    refreshStatusUpdatesPanel();
    refreshStatusUpdates();
    setInterval(refreshStatusUpdates, statusUpdatesState.refreshSeconds * 1000);
  }

  function applySplashSettings() {
    splashSettings.forEach((name) => {
      const storedValue = localStorage.getItem(`wavebreaker_${name}`);
      const enabled = storedValue === null
        ? params.get(name) === "1" || params.get(name) === "true" || params.get(name) === ""
        : storedValue === "1";
      document.body.classList.toggle(name, enabled);
      document.querySelectorAll(`[data-setting="${name}"]`).forEach((checkbox) => {
        checkbox.checked = enabled;
      });
    });
  }

  function setupSettingsModal() {
    const button = document.getElementById("settings-button");
    const modal = document.getElementById("settings-modal");
    const windowElement = modal ? modal.querySelector(".settings-window") : null;
    const minimize = document.getElementById("settings-minimize");
    const close = document.getElementById("settings-close");
    if (!button || !modal || !windowElement || !minimize || !close) {
      return;
    }

    button.addEventListener("click", () => {
      modal.hidden = false;
      windowElement.classList.remove("settings-minimized");
    });
    minimize.addEventListener("click", () => {
      windowElement.classList.toggle("settings-minimized");
    });
    close.addEventListener("click", () => {
      modal.hidden = true;
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.hidden = true;
      }
    });
    document.querySelectorAll("[data-setting]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        localStorage.setItem(`wavebreaker_${checkbox.dataset.setting}`, checkbox.checked ? "1" : "0");
        document.body.classList.toggle(checkbox.dataset.setting, checkbox.checked);
      });
    });
    applySplashSettings();
  }

  function text(node, fallback = "") {
    return node ? (node.textContent || "").trim() : fallback;
  }

  function attr(node, name, fallback = "") {
    return node ? (node.getAttribute(name) || fallback) : fallback;
  }

  function makeLink(label, url) {
    const link = document.createElement("a");
    link.textContent = label;
    link.href = url;
    link.target = "_external";
    link.rel = "noopener noreferrer";
    return link;
  }

  function formatFeedDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "numeric"
    }).format(date);
  }

  function makeFeedLink(item) {
    const link = makeLink("", item.url);
    const date = formatFeedDate(item.date);
    if (date) {
      const datePrefix = document.createElement("span");
      datePrefix.className = "feed-date";
      datePrefix.textContent = `[${date}] `;
      link.appendChild(datePrefix);
    }
    link.append(document.createTextNode(item.title));
    return link;
  }

  function makeCategoryLink(label, url) {
    const link = makeLink("", url);
    const firstLetter = document.createElement("span");
    firstLetter.className = "category-initial";
    firstLetter.textContent = label.slice(0, 1);
    link.append(firstLetter, document.createTextNode(label.slice(1)));
    return link;
  }

  function renderBrand(config) {
    const branding = config.querySelector("branding");
    const root = document.documentElement;
    root.style.setProperty("--background", text(branding.querySelector("backgroundColor"), "#202020"));
    root.style.setProperty("--accent", text(branding.querySelector("accentColor"), "#1f9bd1"));
    root.style.setProperty("--text", text(branding.querySelector("textColor"), "#ffffff"));
    const brandName = text(branding.querySelector("name"), "Wavebreaker");
    document.title = `${brandName} Splash`;
    document.getElementById("hero-logo").src = text(branding.querySelector("logo"), "wavebreaker_logo.png");
    document.getElementById("hero-name").textContent = brandName;
  }

  function renderLinks(config) {
    const wikiHost = document.getElementById("wiki-links");
    config.querySelectorAll("links > wiki, links > jira, links > help").forEach((item) => {
      wikiHost.appendChild(makeLink(attr(item, "label"), attr(item, "url")));
    });
  }

  function renderPanels(config) {
    const host = document.getElementById("summary-panels");
    config.querySelectorAll("panels > panel").forEach((panel) => {
      const card = document.createElement("article");
      card.className = "card";
      const title = document.createElement("h2");
      title.textContent = attr(panel, "title");
      card.appendChild(title);
      panel.querySelectorAll("line").forEach((line) => {
        const paragraph = document.createElement("p");
        const key = attr(line, "data");
        if (key) {
          paragraph.dataset.panelKey = key;
          paragraph.classList.add(`panel-line-${key}`);
        }
        if (key) {
          setPanelContent(paragraph, key);
        } else {
          paragraph.textContent = text(line);
        }
        if (key === "status_updates") {
          paragraph.classList.add("status-updates");
        }
        if (!paragraph.textContent) {
          if (key === "status_updates") {
            paragraph.textContent = "";
          }
        }
        if (!paragraph.textContent && key !== "status_updates") {
          paragraph.className = "notice";
          paragraph.textContent = "Not provided";
        }
        card.appendChild(paragraph);
      });
      host.appendChild(card);
    });
  }

  function parseFeedItems(feedDocument, limit) {
    const rssItems = Array.from(feedDocument.querySelectorAll("item")).map((item) => ({
      title: text(item.querySelector("title"), "Untitled"),
      url: text(item.querySelector("link"), "#"),
      date: text(item.querySelector("pubDate"), "")
    }));
    if (rssItems.length) {
      return rssItems.slice(0, limit);
    }

    return Array.from(feedDocument.querySelectorAll("entry")).map((item) => ({
      title: text(item.querySelector("title"), "Untitled"),
      url: attr(item.querySelector("link[href]"), "href", "#"),
      date: text(item.querySelector("updated"), text(item.querySelector("published"), ""))
    })).slice(0, limit);
  }

  function renderFeedShell(feedConfig) {
    const article = document.createElement("article");
    article.className = attr(feedConfig, "type") === "categories" ? "feed feed-categories" : "feed";
    const title = document.createElement("h2");
    const titleLink = attr(feedConfig, "link");
    if (titleLink) {
      title.appendChild(makeLink(attr(feedConfig, "title"), titleLink));
    } else {
      title.textContent = attr(feedConfig, "title");
    }
    const list = document.createElement("ul");
    const notice = document.createElement("p");
    notice.className = "notice";
    notice.textContent = "Loading…";
    article.append(title, list, notice);
    document.getElementById("feeds").appendChild(article);
    return { list, notice };
  }

  async function renderFeeds(config) {
    for (const feedConfig of config.querySelectorAll("feeds > feed")) {
      const { list, notice } = renderFeedShell(feedConfig);
      if (attr(feedConfig, "type") === "categories") {
        list.className = "category-list";
        list.replaceChildren(...Array.from(feedConfig.querySelectorAll("category")).map((category) => {
          const li = document.createElement("li");
          li.appendChild(makeCategoryLink(attr(category, "label"), attr(category, "url", "#")));
          return li;
        }));
        notice.textContent = "";
        continue;
      }

      const url = attr(feedConfig, "url");
      const limit = Number(attr(feedConfig, "limit", "3"));
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const body = await response.text();
        const feedDocument = new DOMParser().parseFromString(body, "application/xml");
        const items = parseFeedItems(feedDocument, limit);
        list.replaceChildren(...items.map((item) => {
          const li = document.createElement("li");
          li.appendChild(makeFeedLink(item));
          return li;
        }));
        notice.textContent = items.length ? "" : "No items found.";
      } catch (error) {
        notice.textContent = `Unable to load ${url}`;
      }
    }
  }

  const defaultDestinationTabs = [
    { id: "new", label: "Recent" },
    { id: "popular", label: "Popular" },
    { id: "events", label: "Featured" },
    { id: "editor", label: "Editors' Picks" },
    { id: "newbie", label: "Newcomer Friendly" }
  ];

  function getDestinationTabs(destinationConfig) {
    const configuredTabs = Array.from(destinationConfig.querySelectorAll("tab")).map((tab) => ({
      id: attr(tab, "id"),
      label: attr(tab, "label"),
      source: attr(tab, "source"),
      category: attr(tab, "category"),
      sort: attr(tab, "sort")
    })).filter((tab) => tab.id && tab.label);

    return configuredTabs.length ? configuredTabs : defaultDestinationTabs;
  }

  function getDestinationSource(destinationConfig, tab = {}) {
    if (tab.source) {
      return tab.source;
    }

    const sourceBase = attr(destinationConfig, "sourceBase");
    const sourceSuffix = attr(destinationConfig, "sourceSuffix", ".json");
    if (sourceBase) {
      return `${sourceBase}${tab.id}${sourceSuffix}`;
    }

    return attr(destinationConfig, "source");
  }

  function getDestinationItems(data) {
    if (Array.isArray(data)) {
      return data;
    }

    return Object.values(data).flat().filter((item) => item && typeof item === "object");
  }

  function getDestinationCategories(item) {
    if (!Array.isArray(item.categories)) {
      return [];
    }

    return item.categories.map((category) => category.simple_name || category.name || category.slug || "").filter(Boolean);
  }

  function getDestinationPopularity(item) {
    const popCount = Number(item.pop && item.pop.count);
    const currentPopulation = Number(item.population && item.population.current);
    return Math.max(Number.isFinite(popCount) ? popCount : 0, Number.isFinite(currentPopulation) ? currentPopulation : 0);
  }

  function getDestinationDate(item) {
    const value = Date.parse(item.publish_date || item.created_at || item.updated_at || "");
    return Number.isFinite(value) ? value : 0;
  }

  function shuffleDestinations(items) {
    const shuffled = items.slice();
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function filterDestinationItems(items, tab) {
    const category = tab.category || (tab.sort ? "" : tab.id);
    let filteredItems = category
      ? items.filter((item) => getDestinationCategories(item).includes(category))
      : items.slice();

    if (!filteredItems.length) {
      filteredItems = items.slice();
    }

    if (tab.sort === "popular") {
      return filteredItems.sort((left, right) => getDestinationPopularity(right) - getDestinationPopularity(left));
    }

    if (category === "new") {
      return filteredItems.sort((left, right) => getDestinationDate(right) - getDestinationDate(left));
    }

    return shuffleDestinations(filteredItems);
  }

  function usesSharedDestinationSource(destinationConfig, tab) {
    return !tab.source && attr(destinationConfig, "source") && !attr(destinationConfig, "sourceBase");
  }

  async function loadDestinationData(destinationConfig, tab, destinationCache) {
    const source = getDestinationSource(destinationConfig, tab);
    if (!source) {
      return [];
    }

    if (!destinationCache.has(source)) {
      destinationCache.set(source, fetch(source, { cache: "no-store" }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      }).then(getDestinationItems));
    }

    return destinationCache.get(source);
  }

  function getDestinationImage(item, preferredType) {
    if (!Array.isArray(item.assets)) {
      return "";
    }

    const preferredAsset = item.assets.find((asset) => asset.type === preferredType);
    const fallbackAsset = item.assets.find((asset) => asset.type === "midsize")
      || item.assets.find((asset) => asset.type === "thumbnail")
      || item.assets.find((asset) => asset.type === "fullsize");
    return (preferredAsset || fallbackAsset || {}).data || "";
  }

  function renderDestinationCard(item) {
    const label = item.title || item.name || item.region || "Destination";
    const url = item.slurl || item.url || item.link || "#";
    const image = getDestinationImage(item, "midsize");
    const card = document.createElement("a");
    card.className = "destination-card";
    card.href = url;
    card.target = "_external";
    card.rel = "noopener noreferrer";
    card.title = label;

    if (image) {
      const img = document.createElement("img");
      img.src = image;
      img.alt = "";
      img.loading = "lazy";
      img.addEventListener("error", () => img.remove(), { once: true });
      card.appendChild(img);
    }

    const caption = document.createElement("span");
    caption.textContent = label;
    card.appendChild(caption);
    return card;
  }

  async function loadDestinationTab(destinationConfig, tab, pane, loadedTabs, destinationCache) {
    if (loadedTabs.has(tab.id)) {
      return;
    }

    loadedTabs.add(tab.id);
    const source = getDestinationSource(destinationConfig, tab);
    const limit = Number(attr(destinationConfig, "limit", "24"));
    pane.textContent = "Loading…";

    try {
      const data = await loadDestinationData(destinationConfig, tab, destinationCache);
      const items = (usesSharedDestinationSource(destinationConfig, tab)
        ? filterDestinationItems(data, tab)
        : shuffleDestinations(data)).slice(0, limit);
      pane.replaceChildren(...items.map(renderDestinationCard));
      if (!items.length) {
        pane.textContent = "No destinations found.";
      }
    } catch (error) {
      pane.textContent = `Unable to load ${source}`;
    }
  }

  function activateDestinationTab(tabId, tabsHost, panesHost) {
    tabsHost.querySelectorAll(".destination-tab").forEach((tabButton) => {
      tabButton.classList.toggle("active", tabButton.dataset.tab === tabId);
    });
    panesHost.querySelectorAll(".destination-pane").forEach((pane) => {
      pane.classList.toggle("active", pane.dataset.tab === tabId);
    });
  }

  async function renderDestinations(config) {
    const destinationConfig = config.querySelector("destinations");
    const host = document.getElementById("destinations");
    if (!destinationConfig) {
      host.hidden = true;
      return;
    }

    const tabs = getDestinationTabs(destinationConfig);
    const loadedTabs = new Set();
    const destinationCache = new Map();
    const tabsHost = document.createElement("div");
    tabsHost.className = "destination-tabs";
    const panesHost = document.createElement("div");
    panesHost.className = "destination-panes";

    tabs.forEach((tab, index) => {
      const tabButton = document.createElement("button");
      tabButton.className = "destination-tab";
      tabButton.type = "button";
      tabButton.dataset.tab = tab.id;
      tabButton.textContent = tab.label;
      tabButton.addEventListener("click", () => {
        activateDestinationTab(tab.id, tabsHost, panesHost);
        loadDestinationTab(destinationConfig, tab, panesHost.querySelector(`[data-tab="${tab.id}"]`), loadedTabs, destinationCache);
      });
      tabsHost.appendChild(tabButton);

      const pane = document.createElement("div");
      pane.className = "destination-pane";
      pane.dataset.tab = tab.id;
      panesHost.appendChild(pane);

      if (index === 0) {
        tabButton.classList.add("active");
        pane.classList.add("active");
      }
    });

    panesHost.addEventListener("wheel", (event) => {
      const activePane = panesHost.querySelector(".destination-pane.active");
      if (!activePane || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      activePane.scrollLeft += event.deltaY;
      event.preventDefault();
    }, { passive: false });

    host.replaceChildren(tabsHost, panesHost);
    loadDestinationTab(destinationConfig, tabs[0], panesHost.querySelector(`[data-tab="${tabs[0].id}"]`), loadedTabs, destinationCache);
  }

  async function start() {
    let xml = window.WAVEBREAKER_SPLASH_XML || "";
    if (xml && typeof xml !== "string" && typeof xml.value === "string") {
      xml = xml.value;
    }
    if (!xml) {
      const response = await fetch("splash.xml", { cache: "no-store" });
      xml = await response.text();
    }
    const config = new DOMParser().parseFromString(xml, "application/xml");
    if (!config.querySelector("branding")) {
      throw new Error("splash.xml is missing the branding section");
    }
    configureLatestVersion(config);
    configureGridStatus(config);
    configureStatusUpdates(config);
    renderBrand(config);
    renderLinks(config);
    renderPanels(config);
    setupSettingsModal();
    startSecondLifeClock();
    startGridStatus();
    startLatestVersion();
    startStatusUpdates();
    renderFeeds(config);
    renderDestinations(config);
  }

  start().catch((error) => {
    document.getElementById("app").innerHTML = `<p class="notice">Unable to load local splash.xml: ${error.message}</p>`;
  });
})();
