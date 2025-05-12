const content = [
  {
    title: "Welcome",
    html: `
      <div class="cover-page">
        <h2>ORDER OF SERVICE FOR THE MARRIAGE OF</h2>
        <h1 class="names">Bride Name Placeholder</h1>
        <h1 class="ampersand">&amp;</h1>
        <h1 class="names">Groom Name Placeholder</h1>
        <p class="details">Location of Ceremony Placeholder</p>
        <p class="details">Date of Wedding Placeholder</p>
        <p class="details">Time to Arrive Placeholder</p>
      </div>`,
    centerHorizontal: true,
    centerVertical: true
  },
  {
    title: "Wedding Party",
    html: `
      <ul class="party-list">
        <li><strong>Officiant:</strong> Reverend Briony Mackie</li>
        <li><strong>Parents of the Bride:</strong> Names Placeholder</li>
        <li><strong>Parents of the Groom:</strong> Names Placeholder</li>
        <li><strong>Maid of Honour:</strong> Name Placeholder</li>
        <li><strong>Bridesmaid:</strong> Name Placeholder</li>
        <li><strong>Best Man:</strong> Name Placeholder</li>
        <li><strong>Groomsmen:</strong> Names Placeholder</li>
        <li><strong>Ring Bearer:</strong> Name Placeholder</li>
      </ul>`
  },
  {
    title: "Order of the Day",
    text: "Follow the beautiful journey from the entrance to the blessing."
  },
  {
    title: "Entrance of the Bride",
    text: "Music: Ave Maria"
  },
  {
    title: "Welcome & Introduction",
    text: "By Reverend Briony Mackie"
  },
  {
    title: "HYMN: Lead Us, Heavenly Father, Lead Us",
    class: "hymn",
    html: `
      <div class="scrollable-block">
        <p>
          Lead us, heavenly Father, lead us<br>
          through this world's tempestuous sea;<br>
          guard us, guide us, keep us, feed us<br>
          for your help is full and free,<br>
          here possessing every blessing<br>
          if our God our Father be.
        </p>
        <br>
        <p>
          Saviour, by your grace restore us -<br>
          all our weaknesses are plain;<br>
          you have lived on earth before us,<br>
          you have felt our grief and pain:<br>
          tempted, taunted, yet undaunted,<br>
          from the depths you rose again.
        </p>
        <br>
        <p>
          Spirit of our God, descending,<br>
          fill our hearts with holy peace;<br>
          love with every passion blending,<br>
          pleasure that can never cease:<br>
          thus provided, pardoned, guided,<br>
          ever shall our joys increase.
        </p>
      </div>
    `
  },    
  {
    title: "The Declarations",
    text: "By Reverend"
  },
  {
    title: "Reading: 1 Corinthians 13:1–13",
    class: "reading",
    html: `
      <p>1 If I speak in the tongues of men and of angels, but have not love, I am a noisy gong...</p>`
  },
  {
    title: "Reading: John 4:7–12",
    class: "reading",
    html: `
      <p>7 Dear friends, let us love one another, for love comes from God...</p>`
  },
  {
    title: "HYMN: Grace ‘Tis a Perfect Sound",
    class: "hymn",
    html: `
      <p>1 Grace! 'tis a charming sound... (lyrics)</p>`
  },
  {
    title: "Reading: Captain Corelli’s Mandolin",
    class: "reading",
    html: `
      <p>Love is a temporary madness... (full passage)</p>`
  },
  {
    title: "Sermon",
    text: "By Reverend"
  },
  {
    title: "The Vows & Rings",
    text: "Exchange of vows and rings between the Bride & Groom"
  },
  {
    title: "Signing of Registers",
    text: "Music: Stand by Me – Ben E King"
  },
  {
    title: "Prayers",
    text: "Led by Reverend"
  },
  {
    title: "The Lord’s Prayer",
    class: "prayer",
    html: `
      <p>Our Father, who art in heaven... Amen</p>`
  },
  {
    title: "The Blessing",
    text: "By Reverend"
  },
  {
    title: "The Recessional",
    text: "Music: Best of My Love – The Emotions"
  },
  {
    title: "Final Info",
    text: "Guests are kindly invited to form two lines outside the church for a celebratory confetti send-off."
  }
];

const sectionsContainer = document.getElementById("sections");
const menuList = document.getElementById("menuList");
const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("menuToggle");
const closeButton = document.getElementById("closeSidebar");

content.forEach((item, index) => {
  const section = document.createElement("div");
  section.className = `section colorful ${item.class || ""}`;
  if (item.centerHorizontal) section.classList.add("center-horizontal");
  if (item.centerVertical) section.classList.add("center-vertical");

  section.id = `section-${index}`;
  section.innerHTML = `
    <div class="section-content">
      <h1>${item.title}</h1>
      ${item.text ? `<p>${item.text}</p>` : item.html || ""}
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

// Sidebar controls
toggleButton.addEventListener("click", () => {
  sidebar.classList.add("open");
  toggleButton.classList.add("hidden");
});

closeButton.addEventListener("click", () => {
  sidebar.classList.remove("open");
  toggleButton.classList.remove("hidden");
});

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") nextSection();
  if (e.key === "ArrowLeft") prevSection();
});
