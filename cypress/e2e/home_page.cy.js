const port = 3000;

describe("home page", () => {
    it("the h1 contains the correct text", () => {
      cy.visit(`http://localhost:${port}`)
      cy.get("h1").contains("Wurdz")
    })
  })

  