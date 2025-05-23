const content = [
  {
    title: "Upload & View Photos",
    class: "upload-gallery",
    html: `
    <div class="upload-container">
      <input type="file" id="fileInput" multiple accept=".jpg,.jpeg,.png,.zip" />

      <button onclick="startUpload()" class="upload-btn">Upload Files</button>

      <p class="upload-instructions">
        Please upload any photos or videos you’ve taken today.<br>
        You can upload images or a .zip file (max 100MB).
      </p>

      <p id="uploadStatus" class="upload-status"></p>
    </div>
  `,
    centerHorizontal: true,
    centerVertical: false
  },
];

    // <div id="gallery" class="scrolling-inner gallery-grid">
    //   <p>Loading photos...</p>
    // </div>

const sectionsContainer = document.getElementById("sections");
const menuList = document.getElementById("menuList");
const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("menuToggle");
const closeButton = document.getElementById("closeSidebar");

let currentSection = 0;

// Build sections from content array
content.forEach((item, index) => {
  const section = document.createElement("div");
  section.className = `section colorful ${item.class || ""}`;
  if (item.centerHorizontal) section.classList.add("center-horizontal");
  if (item.centerVertical) section.classList.add("center-vertical");
  section.id = `section-${index}`;

  section.innerHTML = `
    <div class="content-container">
      <div class="section-content">
        <h1>${item.title}</h1>
        ${item.text ? `<p>${item.text}</p>` : item.html || ""}
      </div>
    </div>
    <div class="nav-floating-buttons">
      <button onclick="prevSection()" aria-label="Previous Section" class="nav-btn">&lt;</button>
      <button onclick="nextSection()" aria-label="Next Section" class="nav-btn">&gt;</button>
    </div>
  `;

  sectionsContainer.appendChild(section);

  const menuItem = document.createElement("li");
  menuItem.innerHTML = `<a href="#" onclick="goToSection(${index})">${item.title}</a>`;
  menuList.appendChild(menuItem);
});

function showSection(index) {
  document.querySelectorAll(".section").forEach((sec, i) => {
    sec.style.display = i === index ? "flex" : "none";
  });

  if (content[index].confetti) {
    launchConfetti();
  }

  if (
    content[index].class === "gallery" ||
    content[index].class === "upload-gallery"
  ) {
    loadGalleryImages();
  }
}

function nextSection() {
  if (currentSection < content.length - 1) {
    currentSection++;
    localStorage.setItem('currentSectionIndex', currentSection);
    showSection(currentSection);
  }
}

function prevSection() {
  if (currentSection > 0) {
    currentSection--;
    localStorage.setItem('currentSectionIndex', currentSection);
    showSection(currentSection);
  }
}

function goToSection(index) {
  currentSection = index;
  localStorage.setItem('currentSectionIndex', currentSection);
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

// Swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", function (e) {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", function (e) {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
});

function handleGesture() {
  const swipeDistance = 50;
  if (touchEndX < touchStartX - swipeDistance) {
    nextSection();
  }
  if (touchEndX > touchStartX + swipeDistance) {
    prevSection();
  }
}

// Toast notice
window.addEventListener("load", () => {
  const hasSeenToast = localStorage.getItem("seenSwipeToast");
  const toast = document.getElementById("swipe-toast");
  const closeBtn = document.getElementById("dismiss-toast");

  if (window.innerWidth <= 768) {
    toast.classList.add("show");

    closeBtn.addEventListener("click", () => {
      toast.classList.remove("show");
      localStorage.setItem("seenSwipeToast", "true");
    });
  }
});

function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

async function startUpload() {
  const input = document.getElementById("fileInput");
  const status = document.getElementById("uploadStatus");
  status.textContent = "";

  const files = input.files;
  if (!files.length) {
    status.textContent = "Please select at least one file.";
    return;
  }

  const MAX_SIZE_MB = 100;
  let totalSize = 0;
  for (const file of files) {
    totalSize += file.size;
  }
  if (totalSize > MAX_SIZE_MB * 1024 * 1024) {
    status.textContent = "Total upload size exceeds 100MB.";
    return;
  }

  status.textContent = "Uploading files...";

  for (const file of files) {
    try {
      const res = await fetch('https://api-main.thecontentbench.com/upload-url', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({
          userId: 'wedding-user',
          fileName: file.name,
          contentType: file.type,
          fileExtension: file.name.split(".").slice(-1)[0],
          fileSizeMb: file.size,
          serviceName: 'UPLOAD',
          contentType: file.type,
        })
      });

      const { response } = await res.json();

      const configUrlForUpload = (resp) => {
        const formData = new FormData();
        Object.keys(resp.fields).forEach(key => formData.append(key, resp.fields[key]));
        formData.append('file', file);
        return { url: resp.url, data: formData };
      };

      const upload = async (url, formData) => {
        const uploadResponse = await fetch(url, { method: 'POST', body: formData });
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload. Please try again later.');
        }
      };

      const config = configUrlForUpload(response);
      await upload(config.url, config.data);

    } catch (err) {
      console.error("Upload failed:", err);
      status.textContent = "🚫🚫🚫Upload FAILED for one or more files.🚫🚫🚫";
      return;
    }
  }

  status.textContent = "✅ Upload successful! Thank you 🎉";
  setTimeout(() => location.reload(), 3000);
}

// Restore last section from localStorage
const savedIndex = parseInt(localStorage.getItem('currentSectionIndex'), 10);
if (!isNaN(savedIndex) && savedIndex >= 0 && savedIndex < content.length) {
  currentSection = savedIndex;
}

async function loadGalleryImages() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  try {
    const res = await fetch('https://api-main.thecontentbench.com/files', {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify({
        userId: 'wedding-user',
        serviceName: 'UPLOAD',
      })
    });
    const { response } = await res.json();

    if (!response.length) {
      gallery.innerHTML = "<p>No photos uploaded yet. Check back later!</p>";
      return;
    }

    gallery.innerHTML = ""; // Clear loading text

    response.forEach(file => {
      const img = document.createElement("img");
      img.src = file;
      img.alt = "Uploaded Photo";
      gallery.appendChild(img);
    });
  } catch (err) {
    console.error("Error loading gallery:", err);
    gallery.innerHTML = "<p>Failed to load images. Please try again later.</p>";
  }
}

showSection(currentSection);
