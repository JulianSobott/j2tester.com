window.onload = () => {
    document.getElementById("renderBtn").addEventListener("click", renderTemplate);
};
const elements = {
    template: document.getElementById("template"),
    variables: document.getElementById("variables"),
    outputDiv: document.getElementById("output"),
    errorAlert: document.getElementById("errorAlert"),
};

const toggleVisibility = (element, show) => element.classList.toggle("d-none", !show);
const toggleDanger = (element, show) => element.classList.toggle("text-danger", show);

const showError = (message) => {
    elements.errorAlert.textContent = message;
    toggleVisibility(elements.errorAlert, true);
};

const renderTemplate = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const template = elements.template.value.trim();
    const variables = elements.variables.value.trim();

    if (!template) {
        toggleDanger(elements.outputDiv, true);
        elements.outputDiv.textContent = "Template input cannot be empty.";
        return;
    }

    toggleVisibility(elements.errorAlert, false);

    try {
        const response = await fetch("/api/render", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ template, variables }),
        });

        const result = await response.json();

        if (!result.error && result.results) {
            toggleDanger(elements.outputDiv, false);
            elements.outputDiv.textContent = result.results;
            hljs.highlightBlock(elements.outputDiv);
        } else {
            toggleDanger(elements.outputDiv, true);
            elements.outputDiv.textContent = result.msg || "Unknown error occurred";
        }
    } catch {
        showError("An unexpected error occurred.");
    }
};
