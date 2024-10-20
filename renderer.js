document.getElementById("submitBtn").addEventListener("click", () => {
  const patientData = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    symptoms: document.getElementById("symptoms").value,
  };

  window.electron.invoke("get-diagnostic", patientData).then((result) => {
    document.getElementById(
      "diagnosticResult"
    ).innerText = `Diagnostic suggéré : ${result}`;
  });
});
