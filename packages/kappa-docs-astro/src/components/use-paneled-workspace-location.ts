import { computed, ref } from "vue";
import { projectContextPages, resolveWorkspacePage, workspacePages } from "./paneled-workspace-navigation";
import { workspaceProjects, type WorkspaceProject } from "./paneled-workspace-projects";

// Navigation state belongs to the example. Sidebar parts do not depend on a router.
export function usePaneledWorkspaceLocation(standalone: boolean) {
  const projects = ref(workspaceProjects.map(project => ({ ...project })));
  const view = ref("Simulation runs");
  const selectedProject = ref<WorkspaceProject>();
  // Keep the outgoing project's content intact until its slide has finished.
  const lastProject = ref(projects.value[0]);
  const overviewPage = (project: WorkspaceProject) => workspaceProjects.find(item => item.code === project.code)!.name;
  const isProjectOverview = computed(() => !!selectedProject.value && overviewPage(selectedProject.value) === view.value);

  function destination(requested: string, projectCode = selectedProject.value?.code) {
    const resolved = resolveWorkspacePage(requested);
    const namedProject = projects.value.find(project => project.code === resolved || overviewPage(project) === resolved);
    let page = namedProject ? overviewPage(namedProject) : workspacePages.includes(resolved) ? resolved : "Dashboard";
    let project = namedProject ?? projects.value.find(project => project.code === projectCode);
    if (!namedProject && !projectContextPages.includes(page)) project = undefined;
    // Old project-page bookmarks did not carry a project code.
    if (!project && projectContextPages.includes(page) && !["Simulation runs", "Compute usage"].includes(page)) {
      project = projects.value.find(item => item.code === "AV-07");
    }
    if (page === "Overview" && project) page = overviewPage(project);
    return { page, project };
  }

  function renameProject(name: string) {
    if (selectedProject.value && name.trim()) selectedProject.value.name = name.trim();
  }

  function hrefForPage(page: string) {
    const target = destination(page);
    const params = new URLSearchParams({ view: target.page });
    if (target.project) params.set("project", target.project.code);
    return `${standalone ? "" : "/examples/appshell/paneled-workspace"}?${params}`;
  }

  function selectPage(page: string, updateLocation = true, projectCode = selectedProject.value?.code) {
    const target = destination(page, projectCode);
    const contextChanged = target.project?.code !== selectedProject.value?.code;
    view.value = target.page;
    selectedProject.value = target.project;
    if (target.project) lastProject.value = target.project;
    if (standalone && updateLocation) {
      const url = new URL(window.location.href);
      url.searchParams.set("view", target.page);
      if (target.project) url.searchParams.set("project", target.project.code);
      else url.searchParams.delete("project");
      if (url.href !== window.location.href) window.history.pushState(null, "", url);
    }
    return contextChanged;
  }

  function readLocation() {
    const url = new URL(window.location.href);
    // An empty code explicitly leaves the previous project on browser Back.
    selectPage(url.searchParams.get("view") ?? "Simulation runs", false, url.searchParams.get("project") ?? "");
    url.searchParams.set("view", view.value);
    if (selectedProject.value) url.searchParams.set("project", selectedProject.value.code);
    else url.searchParams.delete("project");
    if (url.href !== window.location.href) window.history.replaceState(null, "", url);
  }

  return { projects, view, selectedProject, lastProject, isProjectOverview, hrefForPage, selectPage, readLocation, renameProject };
}
