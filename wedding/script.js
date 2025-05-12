const content = [
    {
        title: "Welcome",
        html: `
          <div class="cover-page">
            <h2>ORDER OF SERVICE FOR THE MARRIAGE OF</h2>
            <h1 class="names">Shanice Wilson</h1>
            <h1 class="ampersand">&amp;</h1>
            <h1 class="names">Moyin Koiki</h1>
            <p class="details">All Saints Church Fulham</p>
            <p class="details">Thursday, 22nd May 2025.</p>
            <p class="details">@ 10:30 AM</p>
          </div>`
    },
    {
        title: "Wedding Party",
        class: "wedding-party-list",
        html: `
          <div class="party-list-wrapper">
            <ul class="party-list">
              <li>
                <img src="https://picsum.photos/seed/officiant/80" alt="Officiant" class="party-avatar">
                <div><strong>Officiant:</strong> Reverend James Smith</div>
              </li>
              <li>
                <img src="https://picsum.photos/seed/parentsbride/80" alt="Parents of the Bride" class="party-avatar">
                <div><strong>Parents of the Bride:</strong> Names Placeholder</div>
              </li>
              <li>
                <img src="https://picsum.photos/seed/parentsgroom/80" alt="Parents of the Groom" class="party-avatar">
                <div><strong>Parents of the Groom:</strong> Names Placeholder</div>
              </li>
              <li>
                <img src="https://picsum.photos/seed/maid/80" alt="Maid of Honour" class="party-avatar">
                <div><strong>Maid of Honour:</strong> Name Placeholder</div>
              </li>
              <li>
                <img src="https://picsum.photos/seed/bridesmaid/80" alt="Bridesmaid" class="party-avatar">
                <div><strong>Bridesmaid:</strong> Name Placeholder</div>
              </li>
              <li>
                <img src="https://picsum.photos/seed/bestman/80" alt="Best Man" class="party-avatar">
                <div><strong>Best Man:</strong> Name Placeholder</div>
              </li>
              <li>
                <img src="https://picsum.photos/seed/groomsmen/80" alt="Groomsmen" class="party-avatar">
                <div><strong>Groomsmen:</strong> Names Placeholder</div>
              </li>
              <li>
                <img src="https://picsum.photos/seed/ringbearer/80" alt="Ring Bearer" class="party-avatar">
                <div><strong>Ring Bearer:</strong> Name Placeholder</div>
              </li>
            </ul>
          </div>
        `
    },
    { title: "Order of the Day", text: "Follow the beautiful journey from the entrance to the blessing." },
    { title: "Entrance of the Bride", text: "Music: Ave Maria" },
    { title: "Welcome & Introduction", text: "By Reverend Briony Mackie" },
    { title: "HYMN: Lead Us, Heavenly Father, Lead Us", class: "hymn", html: "<p>Lead us, heavenly Father, lead us... (lyrics)</p>" },
    { title: "The Declarations", text: "By Reverend" },
    { title: "Reading: 1 Corinthians 13:1-13", class: "reading", html: "<p>1 If I speak in the tongues of men... (full passage)</p>" },
    { title: "Reading: John 4:7-12", class: "reading", html: "<p>7 Dear friends, let us love one another... (full passage)</p>" },
    { title: "HYMN: Grace 'Tis a Perfect Sound", class: "hymn", html: "<p>1 Grace! 'tis a charming sound... (lyrics)</p>" },
    { title: "Reading: Captain Corelli's Mandolin", class: "reading", html: "<p>Love is a temporary madness... (full passage)</p>" },
    { title: "Sermon", text: "By Reverend" },
    { title: "The Vows & Rings", text: "Exchange of vows and rings between the Bride & Groom" },
    { title: "Signing of Registers", text: "Music: Stand by Me - Ben E King" },
    { title: "Prayers", text: "Led by Reverend" },
    { title: "The Lord's Prayer", class: "prayer", html: "<p>Our Father, who art in heaven... Amen</p>" },
    { title: "The Blessing", text: "By Reverend" },
    { title: "The Recessional", text: "Music: Best of My Love - The Emotions" },
    { title: "Final Info", text: "Guests are kindly invited to form two lines outside the church for a celebratory confetti send-off." }
];

const sectionsContainer = document.getElementById("sections");
const menuList = document.getElementById("menuList");
const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("menuToggle");
const closeButton = document.getElementById("closeSidebar");

content.forEach((item, index) => {
    const section = document.createElement("div");
    section.className = `section colorful ${item.class || ""}`;
    section.id = `section-${index}`;
    section.innerHTML = `
      <div class="section-content">
        <h1>${item.title}</h1>
        ${item.text ? `<p>${item.text}</p>` : item.html}
      </div>`;
    sectionsContainer.appendChild(section);

    const menuItem = document.createElement("li");
    menuItem.innerHTML = `<a href="#" onclick="goToSection(${index})">${item.title}</a>`;
    menuList.appendChild(menuItem);
});

let currentSection = 0;
showSection(currentSection);

function showSection(index) {
    document.querySelectorAll(".section").forEach((sec, i) => {
        sec.style.display = i === index ? "flex" : "none";
    });
}

function nextSection() {
    if (currentSection < content.length - 1) {
        currentSection++;
        showSection(currentSection);
    }
}

function prevSection() {
    if (currentSection > 0) {
        currentSection--;
        showSection(currentSection);
    }
}

function goToSection(index) {
    currentSection = index;
    showSection(currentSection);
    sidebar.classList.remove("open");
    toggleButton.classList.remove("hidden");
}

toggleButton.addEventListener("click", () => {
    sidebar.classList.add("open");
    toggleButton.classList.add("hidden");
});

closeButton.addEventListener("click", () => {
    sidebar.classList.remove("open");
    toggleButton.classList.remove("hidden");
});

document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") nextSection();
    if (e.key === "ArrowLeft") prevSection();
});

