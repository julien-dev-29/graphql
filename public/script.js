const result = document.querySelector("#result");
const jurolResult = document.getElementById("jurol");

async function runQuery() {
  try {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `{ getJurol($name: String!) {
            name
            age
        } }`,
        variables: { name: "jurol" },
      }),
    });

    const payload = await response.json();

    console.log(payload);

    if (!response.ok || payload.errors) {
      const message = payload.errors?.[0]?.message ?? `HTTP ${response.status}`;
      throw new Error(message);
    }

    result.textContent = payload.data.getJurol.name;
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
  }
}

runQuery();
