/**
 * Mirrors all 18 fCC lab tests for the checkout page against a real DOM.
 * Usage: node scripts/verify-tests.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { JSDOM } from "jsdom";

const root = path.dirname(fileURLToPath(import.meta.url));
const html = readFileSync(path.join(root, "..", "index.html"), "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true });
const { window } = dom;
const { document } = window;

await new Promise((resolve) => {
    if (window.document.readyState === "complete") return resolve();
    window.addEventListener("load", resolve);
});

const results = [];
const check = (name, passed) => results.push({ name, passed: Boolean(passed) });
const stripNbsp = (text) => (text || "").replace(/\u00a0/g, " ").trim();

/* 1 — h1 with text Checkout */
const h1s = document.querySelectorAll("h1");
check("1. h1 with text Checkout", h1s.length > 0 && h1s[0].textContent.trim() === "Checkout");

/* 2 — exactly one h1 */
check("2. Only one h1 element", h1s.length === 1);

/* 3 — at least two sections after h1 (sibling relationship, like the fCC `h1 ~ section` selector) */
const h1El = document.querySelector("h1");
const h1Siblings = [...h1El.parentElement.children];
const afterH1 = h1Siblings.slice(h1Siblings.indexOf(h1El) + 1).filter((el) => el.tagName === "SECTION");
check("3. At least two section elements after h1", afterH1.length >= 2);

const [sectionOne, sectionTwo] = afterH1;

/* 4 — h2 Your Cart in first section */
const cartHeading = sectionOne && [...sectionOne.querySelectorAll("h2")]
    .find((h2) => h2.textContent.trim() === "Your Cart");
check("4. h2 'Your Cart' within first section", Boolean(cartHeading));

/* 5 — image with alt in first section */
const cartImages = sectionOne ? [...sectionOne.querySelectorAll("img")] : [];
check("5. Image with alternate text in first section",
    cartImages.length > 0 && cartImages.every((img) => img.hasAttribute("alt") && img.getAttribute("alt").length > 0));

/* 6 — h2 Payment Information in second section */
const payHeading = sectionTwo && [...sectionTwo.querySelectorAll("h2")]
    .find((h2) => h2.textContent.trim() === "Payment Information");
check("6. h2 'Payment Information' within second section", Boolean(payHeading));

/* 7 — form within second section */
const form = sectionTwo ? sectionTwo.querySelector("form") : null;
check("7. form element within second section", Boolean(form));

/* 8 + 9 — card-name input, type text */
const cardName = form ? form.querySelector("input#card-name") : null;
check("8. input#card-name within form", Boolean(cardName));
check("9. card name input type is text", Boolean(cardName) && cardName.getAttribute("type") === "text");

/* 10 + 11 — card-number input, type text */
const cardNumber = form ? form.querySelector("input#card-number") : null;
check("10. input#card-number within form", Boolean(cardNumber));
check("11. card number input type is text", Boolean(cardNumber) && cardNumber.getAttribute("type") === "text");

/* 12 — every non-submit input has an associated label */
const inputs = form ? [...form.querySelectorAll("input")] : [];
const unlabeled = inputs.filter((input) => input.type !== "submit" && input.type !== "button"
    && !(input.labels && input.labels.length > 0));
check("12. All non-submit inputs have a label", inputs.length > 0 && unlabeled.length === 0);

/* 13 — at least two required inputs */
check("13. At least two inputs with required attribute",
    document.querySelectorAll("input[required]").length >= 2);

/* 14 + 15 — required-star span inside each required label, aria-hidden */
const requiredInputs = [...document.querySelectorAll("input[required]")];
const labelsOk = requiredInputs.every((input) => {
    const label = input.labels && input.labels[0];
    return Boolean(label) && [...label.querySelectorAll("span")]
        .some((span) => span.textContent.trim() === "*" && span.getAttribute("aria-hidden") === "true");
});
check("14. Span '*' inside label of each required input", labelsOk);

const allStars = [...document.querySelectorAll("span")]
    .filter((span) => span.textContent.trim() === "*");
check("15. '*' spans have aria-hidden=true",
    allStars.length > 0 && allStars.every((span) => span.getAttribute("aria-hidden") === "true"));

/* 16 — p#card-number-help immediately after card number input */
const helpP = document.getElementById("card-number-help");
check("16. p#card-number-help immediately after card number input",
    Boolean(helpP) && Boolean(cardNumber) && helpP.previousElementSibling === cardNumber);

/* 17 — help text not empty */
check("17. Card number help text is not empty", Boolean(helpP) && stripNbsp(helpP.textContent).length > 0);

/* 18 — aria-describedby on card number input */
check("18. card number input aria-describedby=card-number-help",
    Boolean(cardNumber) && cardNumber.getAttribute("aria-describedby") === "card-number-help");

/* functional smoke checks (bonus) */
const qtyOutput = document.getElementById("qty-output");
const before = qtyOutput.textContent;
document.querySelector(".qty-inc").click();
check("bonus: quantity stepper updates totals",
    qtyOutput.textContent === "2" && document.getElementById("grand").textContent !== before);

const statusRegion = document.getElementById("checkout-status");
const payButton = form.querySelector("button[type='submit']");
document.getElementById("card-name").value = "Ada Lovelace";
cardNumber.value = "4242 4242 4242 4242";
document.getElementById("card-exp").value = "08/28";
document.getElementById("card-cvc").value = "024";
form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
check("bonus: valid submit shows approved status",
    statusRegion.textContent.includes("approved") && payButton.disabled);

let failures = 0;
for (const { name, passed } of results) {
    if (!passed) failures += 1;
    console.log((passed ? "PASS" : "FAIL") + "  " + name);
}
console.log("\n" + (results.length - failures) + "/" + results.length + " checks passed");
process.exit(failures ? 1 : 0);
