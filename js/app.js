// EduLinker - Main Application Logic & UI Controller

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

class App {
  static currentCriteria = {
    subject: "Mathematics",
    grade: "Grade 9-10 (High School)",
    board: "CBSE",
    mode: "Any Mode",
    maxRate: 1500
  };

  static currentRole = "parent"; // 'parent' | 'tutor' | 'admin'
  static activeSubjectFilter = "ALL";
  static selectedTutorForDemo = null;

  static init() {
    App.bindEvents();
    App.renderTutors();
    App.updateAdminStats();
    App.renderDemoRequests();
  }

  static bindEvents() {
    // Simulator form inputs
    const simSubject = document.getElementById("sim-subject");
    const simGrade = document.getElementById("sim-grade");
    const simBoard = document.getElementById("sim-board");
    const simMode = document.getElementById("sim-mode");
    const btnSimulate = document.getElementById("btn-simulate");

    if (btnSimulate) {
      btnSimulate.addEventListener("click", () => {
        App.currentCriteria = {
          subject: simSubject.value,
          grade: simGrade.value,
          board: simBoard.value,
          mode: simMode.value,
          maxRate: 2000
        };
        App.renderTutors();
        App.showToast(`🎯 Recalculated matches for ${simSubject.value} (${simGrade.value})`);
        
        // Scroll smoothly to directory
        document.getElementById("tutor-directory").scrollIntoView({ behavior: "smooth" });
      });
    }

    // Role switcher buttons
    document.querySelectorAll(".switcher-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".switcher-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const role = btn.dataset.role;
        App.setRole(role);
      });
    });

    // Subject Filter Chips
    document.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        App.activeSubjectFilter = chip.dataset.subject;
        App.renderTutors();
      });
    });

    // Demo Modal Close
    document.getElementById("modal-close").addEventListener("click", App.closeDemoModal);
    document.getElementById("modal-overlay").addEventListener("click", (e) => {
      if (e.target.id === "modal-overlay") App.closeDemoModal();
    });

    // Demo Booking Form Submit
    document.getElementById("demo-booking-form").addEventListener("submit", (e) => {
      e.preventDefault();
      App.handleDemoSubmit();
    });

    // Admin Drawer Toggle
    document.getElementById("admin-drawer-close").addEventListener("click", App.toggleAdminDrawer);
    document.getElementById("btn-admin-drawer").addEventListener("click", App.toggleAdminDrawer);
  }

  static setRole(role) {
    App.currentRole = role;
    App.showToast(`Switched view to: ${role.toUpperCase()} MODE`);
    
    if (role === 'admin') {
      App.toggleAdminDrawer(true);
    } else {
      App.toggleAdminDrawer(false);
    }

    if (role === 'tutor') {
      App.showToast("Tutor Portal: Inspect incoming demo enquiries & update KYC status.");
    }
  }

  static renderTutors() {
    const container = document.getElementById("tutors-container");
    if (!container) return;

    let tutors = StorageManager.getTutors();

    // Filter by subject chip if active
    if (App.activeSubjectFilter !== "ALL") {
      tutors = tutors.filter(t => t.subjects.includes(App.activeSubjectFilter));
    }

    // Rank tutors using matching engine
    const rankedTutors = MatchingEngine.rankTutors(tutors, App.currentCriteria);

    container.innerHTML = rankedTutors.map(tutor => `
      <div class="tutor-card" data-tutor-id="${tutor.id}">
        <div class="match-score-badge">
          ⚡ ${tutor.matchScore}% MATCH
        </div>
        <div class="tutor-card-header">
          <img src="${tutor.avatar}" alt="${tutor.name}" class="tutor-avatar" />
          <div class="tutor-info">
            <h3>
              ${tutor.name}
              ${tutor.isVerified ? `<span class="verified-badge">✓ Verified</span>` : `<span class="verified-badge" style="background:#FFD6A5; color:#173300;">⏳ Pending</span>`}
            </h3>
            <div class="tutor-title">${tutor.title}</div>
            <div style="font-size:0.85rem; color:#DD6C3E; font-weight:700; margin-top:0.2rem;">
              ★ ${tutor.rating} <span style="color:#555; font-weight:400;">(${tutor.totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        <div class="tutor-meta">
          ${tutor.subjects.map(s => `<span class="meta-pill" style="background:#A8E5E5;">${s}</span>`).join('')}
          ${tutor.boards.map(b => `<span class="meta-pill" style="background:#F6D0FF;">${b}</span>`).join('')}
          <span class="meta-pill" style="background:#FDE68A;">${tutor.mode}</span>
        </div>

        <p class="tutor-bio">${tutor.bio}</p>

        <div class="tutor-footer">
          <div class="tutor-price">
            ₹${tutor.hourlyRate} <span>/ hr</span>
          </div>
          <button class="btn-primary" onclick="App.openDemoModal('${tutor.id}')">
            Book Demo
          </button>
        </div>
      </div>
    `).join('');
  }

  static openDemoModal(tutorId) {
    const tutors = StorageManager.getTutors();
    const tutor = tutors.find(t => t.id === tutorId);
    if (!tutor) return;

    App.selectedTutorForDemo = tutor;
    document.getElementById("modal-tutor-name").textContent = tutor.name;
    document.getElementById("modal-tutor-spec").textContent = `${tutor.qualification} • ₹${tutor.hourlyRate}/hr`;
    document.getElementById("modal-tutor-avatar").src = tutor.avatar;
    
    document.getElementById("modal-overlay").classList.add("active");
  }

  static closeDemoModal() {
    document.getElementById("modal-overlay").classList.remove("active");
  }

  static handleDemoSubmit() {
    const parentName = document.getElementById("demo-parent-name").value;
    const studentGrade = document.getElementById("demo-student-grade").value;
    const preferredTime = document.getElementById("demo-time").value;
    const demoMode = document.getElementById("demo-mode-select").value;

    const newRequest = {
      id: `demo-${Date.now().toString().slice(-4)}`,
      parentName,
      studentGrade,
      subject: App.currentCriteria.subject || "Mathematics",
      tutorId: App.selectedTutorForDemo.id,
      tutorName: App.selectedTutorForDemo.name,
      requestedTime: preferredTime,
      mode: demoMode,
      status: "CONFIRMED",
      createdAt: new Date().toLocaleString()
    };

    StorageManager.saveDemoRequest(newRequest);
    App.closeDemoModal();
    App.showToast(`🎉 Demo booked with ${App.selectedTutorForDemo.name}!`);
    App.renderDemoRequests();
    App.updateAdminStats();
  }

  static toggleAdminDrawer(forceState) {
    const drawer = document.getElementById("admin-drawer");
    if (!drawer) return;
    if (typeof forceState === 'boolean') {
      forceState ? drawer.classList.add("open") : drawer.classList.remove("open");
    } else {
      drawer.classList.toggle("open");
    }
  }

  static renderDemoRequests() {
    const container = document.getElementById("admin-demo-list");
    if (!container) return;

    const demos = StorageManager.getDemoRequests();
    container.innerHTML = demos.map(d => `
      <div style="background:#FCFAF5; border:1.5px solid #173300; padding:0.85rem; border-radius:8px; margin-bottom:0.75rem;">
        <div style="display:flex; justify-content:space-between; font-weight:800; font-size:0.9rem;">
          <span>${d.parentName} (${d.studentGrade})</span>
          <span style="background:#FFEB5B; padding:0.1rem 0.4rem; border-radius:4px; border:1px solid #173300; font-size:0.75rem;">${d.status}</span>
        </div>
        <div style="font-size:0.82rem; color:#444; margin-top:0.2rem;">
          Tutor: <strong>${d.tutorName}</strong> • ${d.subject}
        </div>
        <div style="font-size:0.78rem; color:#777; margin-top:0.2rem;">
          📅 ${d.requestedTime} (${d.mode})
        </div>
      </div>
    `).join('');
  }

  static updateAdminStats() {
    const tutors = StorageManager.getTutors();
    const demos = StorageManager.getDemoRequests();

    const pendingKyc = tutors.filter(t => t.kycStatus === 'PENDING_VERIFICATION');

    document.getElementById("stat-total-tutors").textContent = tutors.length;
    document.getElementById("stat-pending-kyc").textContent = pendingKyc.length;
    document.getElementById("stat-total-demos").textContent = demos.length;

    const kycContainer = document.getElementById("admin-kyc-list");
    if (kycContainer) {
      if (pendingKyc.length === 0) {
        kycContainer.innerHTML = `<p style="font-size:0.85rem; color:#666;">✓ All tutor KYC credentials verified.</p>`;
      } else {
        kycContainer.innerHTML = pendingKyc.map(t => `
          <div style="background:#FFF; border:1.5px solid #173300; padding:0.75rem; border-radius:8px; margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700; font-size:0.9rem;">${t.name}</div>
              <div style="font-size:0.78rem; color:#666;">${t.qualification}</div>
            </div>
            <button class="btn-primary" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="App.approveKyc('${t.id}')">
              Approve KYC
            </button>
          </div>
        `).join('');
      }
    }
  }

  static approveKyc(tutorId) {
    StorageManager.updateTutorKyc(tutorId, 'APPROVED');
    App.showToast(`Verified tutor credentials & KYC.`);
    App.renderTutors();
    App.updateAdminStats();
  }

  static showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>📌</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}
