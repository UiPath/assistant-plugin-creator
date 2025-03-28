import { WidgetApi, IProcess, ProcessInstallationState, JobStatus, IJobInfo } from "@uipath/widget.sdk";
import { combineLatest } from "rxjs";

declare const api: WidgetApi;

const template = document.createElement("template");
template.innerHTML = `
  <style>

    :host {
      all: initial;
      font-family: noto-sans;
    }

    h2, h3 {
      color: var(--text-main);
    }

    p {
      color: var(--text-secondary-heading);
    }

    .col {
      padding-left: 1.6rem;
      padding-right: 0.4rem;
      font-size: 1.4rem;
    }

    .col h2 {
      font-size: 2rem;
      font-weight: 600;
    }

    .col h3 {
      margin: 1rem 0 0;
      font-size: 1.6rem;
      font-weight: 600;
    }

    .main {
      height: var(--main-window-tab-content-height);
      display: flex;
      flex-direction: column;

      border-color: var(--foreground-divider);
      border-right-width: 0.1rem;
      border-right-style: solid;
    }

    .main .processes-heading {
      margin: 0;
    }

    .processes-list {
      margin-top: 0.8rem;
      padding-right: 0.4rem;
      overflow: auto;
    }

    .process {
      margin: 0.8rem 0;
      padding: 0.8rem;
      border: 1px solid var(--menu-border);
      display: flex;
      align-items: center;
      font-weight: 500;
    }

    .process:first-child {
      margin-top: 0;
    }

    .process .process-letter {
      flex: 0 0 4rem;
      padding-left: 1rem;
      font-size: 2rem;
    }

    .process p {
      margin: 0;
      white-space: nowrap;
    }

    .process .process-name {
      color: var(--text-main);
    }

    .process .process-name-and-version {
      overflow: hidden;
    }

    .process .process-version {
      color: var(--text-deemphasized);
      font-size: 1.2rem;
    }

    .process .process-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: auto;
    }

    .process .process-buttons button {
      margin-right: 0.4rem;
      padding: 0.6rem;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      cursor: pointer;
    }

    .process .process-buttons button svg {
      stroke: var(--icons-action);
    }

    .process .process-buttons button:hover {
      background-color: var(--background-hover);
    }

    .user-info p {
      margin: 0.8rem 0;
    }

    .searchbox-info {
      margin-top: 0.8rem;
    }

    .box {
      font-weight: 500;
    }

    ::-webkit-scrollbar {
      width: 0.8rem;
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 0.4rem;
    }

    ::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar-color);
    }

  </style>

  <div class="col main">
    <h2>Using the Widget Api</h2>
    <h3 class="processes-heading">Displaying the user's processes</h3>
    <div class="processes-list">
    </div>

    <h3>Displaying user info</h3>
    <div class="user-info">
      <p>State: <span class="state"></span></p>
      <p>Username: <span class="username"></span></p>
    </div>

    <h3>Getting the searchbox value</h3>
    <p class="searchbox-info">
      The string below will update as you type in the Home tab search box: <br>
      "<span class="box"></span>"
    </p>
  </div>

  <div class="col second">
    <h2>Second column</h2>
    <p>This column will disappear as you press the "Collapse" button in the top right of the app.</p>
  </div>
`;

export class MainComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const processesListContainer = this.shadowRoot.querySelector(".processes-list");
    const secondColumnContainer = this.shadowRoot.querySelector(".second") as HTMLElement;
    const state = this.shadowRoot.querySelector(".state") as HTMLElement;
    const username = this.shadowRoot.querySelector(".username");
    const box = this.shadowRoot.querySelector(".box");

    combineLatest([api.processList$, api.jobList$])
      .subscribe(([processList, jobList]) => {
        processesListContainer.innerHTML = "";

        processList.forEach(process => {
          const jobs = jobList.filter(jobDetails => jobDetails.job.process.key === process.key)
          processesListContainer.appendChild(this.createProcessEl(process, jobs));
        });
      });

    api.user$.subscribe(userInfo => {
      state.innerHTML = userInfo.state;
      state.style.color = `var(${this.getStatusColor(userInfo.state)})`;
      username.textContent = userInfo.user.userName || "<None>";
    });

    api.showSecondColumn$.subscribe(showSecondColumn => {
      secondColumnContainer.style.display = showSecondColumn ? "block" : "none";
    });

    api.searchValue$.subscribe(value => {
      box.innerHTML = value;
    });
  }

  createProcessEl(process: IProcess, jobs: IJobInfo[]) {
    const hasAnyJobsRunning = jobs.some(jobInfo => jobInfo.status === JobStatus.Running);
    const processLetter = document.createElement("div") as HTMLElement;
    processLetter.innerHTML = process.initialLetter;
    processLetter.style.color = `var(--icons-tile-letter-color-${process.color})`;
    processLetter.className = "process-letter";

    const processName = document.createElement("p");
    processName.innerHTML = process.name;
    processName.className = "process-name";

    const processVersion = document.createElement("p");
    processVersion.className = "process-version";
    processVersion.innerHTML = `Version ${process.version}`;

    const processNameAndVersion = document.createElement("div");
    processNameAndVersion.className = "process-name-and-version";
    processNameAndVersion.appendChild(processName);
    processNameAndVersion.appendChild(processVersion);

    const processButtons = document.createElement("div");
    processButtons.className = "process-buttons";

    if (process.state === ProcessInstallationState.Installed) {
      const runButton = document.createElement("button");
      runButton.className = `run-button run-button-${process.key}`;
      runButton.innerHTML = this.runSvg;
      runButton.style.display = hasAnyJobsRunning ? "none" : "flex";
      runButton.addEventListener("click", () => this.startJob(process.key));
      processButtons.appendChild(runButton);

      const stopButton = document.createElement("button");
      stopButton.className = `stop-button stop-button-${process.key}`;
      stopButton.innerHTML = this.stopSvg;
      stopButton.style.display =  !hasAnyJobsRunning ? "none" : "flex";
      stopButton.addEventListener("click", () => this.stopJobs(jobs));
      processButtons.appendChild(stopButton);
    } else {
      const installButton = document.createElement("button");
      installButton.className = `install-button install-button-${process.key}`;
      installButton.innerHTML = this.installSvg;
      installButton.addEventListener("click", () => this.installProcess(process.key));
      processButtons.appendChild(installButton);
    }

    const processContainer = document.createElement("div");
    processContainer.className = "process";
    processContainer.appendChild(processLetter);
    processContainer.appendChild(processNameAndVersion);
    processContainer.appendChild(processButtons);

    return processContainer;
  }

  startJob(processKey: string) {
    api.startJob({ args: {}, processKey: processKey }).subscribe();
  }

  stopJobs(jobs: IJobInfo[]) {
    jobs.forEach(({ job }) => {
      api.stopJob(job.identifier).subscribe();
    });
  }

  installProcess(processKey: string) {
    api.installProcess(processKey).subscribe();
  }

  getStatusColor(status: string) {
    switch (status) {
      case "SignInUnavailable":
        return "--orchestrator-status-unavailable";
      case "SignedOut":
        return "--orchestrator-status-offline";
      case "SignedInUnconfirmed":
        return "--orchestrator-status-unlicensed";
      case "SignedInConfirmed":
        return "--orchestrator-status-connected";
      default:
        return "--primary-500";
    }
  }

  get runSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(82, 96, 105)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play-circle"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`;
  }

  get stopSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#526069" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-stop-circle"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>`;
  }

  get installSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(82, 96, 105)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
  }
}
