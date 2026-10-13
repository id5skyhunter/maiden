/**
 * MAIDEN — In-Person Appointment Scheduling Controller
 * "schedule an appointment, so bassically we meeting a person"
 */

(function () {
  const AppointmentModal = {
    modalEl: null,
    currentOperator: null,
    currentVersion: null,

    init() {
      this.createModalDOM();
      this.bindEvents();
    },

    createModalDOM() {
      let modal = document.getElementById('appointmentModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'appointmentModal';
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
          <div class="modal-window" style="max-width: 680px;">
            <button class="modal-close-btn" id="closeAppointmentModal" aria-label="Close">
              <i class="ti ti-x"></i>
            </button>
            <div id="appointmentFormContainer" class="deploy-form-wrap">
              <!-- Dynamically populated -->
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      }
      this.modalEl = modal;
    },

    open(operator, versionId) {
      this.currentOperator = operator || window.appState?.operators[0];
      const versions = this.currentOperator?.versions || [];
      this.currentVersion = versions.find(v => v.versionId === versionId) || versions[0];

      this.renderForm();
      this.modalEl.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.modalEl.classList.remove('open');
      document.body.style.overflow = '';
    },

    renderForm() {
      const container = document.getElementById('appointmentFormContainer');
      if (!container || !this.currentOperator || !this.currentVersion) return;

      const op = this.currentOperator;
      const ver = this.currentVersion;
      const status = ver.status || op.status || 'Available';
      const isBusy = status === 'Busy';

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      container.innerHTML = `
        <div class="deploy-header" style="margin-bottom: 20px;">
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
            <span class="badge badge-primary"><i class="ti ti-calendar-event"></i> Direct In-Person Meeting</span>
            <span class="badge ${isBusy ? 'badge-busy' : 'badge-available'}">
              <i class="ti ti-${isBusy ? 'clock-filled' : 'circle-check-filled'}"></i> ${status}
            </span>
          </div>
          <h2 class="deploy-form-title">Schedule Appointment: ${op.name}</h2>
          <p class="deploy-form-subtitle">Arrange an in-person briefing, consultation, or executive conference with ${op.name} (${ver.versionName}).</p>
        </div>

        ${isBusy ? `
          <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 20px; display: flex; gap: 10px; align-items: flex-start;">
            <i class="ti ti-alert-triangle" style="color: #ea580c; font-size: 1.2rem; margin-top: 2px;"></i>
            <div style="font-size: 0.825rem; color: #9a3412;">
              <strong>Active Mission Advisory:</strong> ${op.name} is currently marked as <strong>Busy</strong> on ongoing field operations. You may reserve an upcoming appointment window; confirmation will lock as soon as priority clearance synchronizes.
            </div>
          </div>
        ` : `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 20px; display: flex; gap: 10px; align-items: flex-start;">
            <i class="ti ti-circle-check" style="color: #16a34a; font-size: 1.2rem; margin-top: 2px;"></i>
            <div style="font-size: 0.825rem; color: #166534;">
              <strong>Instant Scheduling Open:</strong> ${op.name} is <strong>Available</strong> for in-person briefings and consultations. Standard confirmation docket issued upon submission.
            </div>
          </div>
        `}

        <form id="appointmentScheduleForm" onsubmit="event.preventDefault(); window.AppointmentModal.submitAppointment();">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label"><i class="ti ti-user-check"></i> Meeting Operator & Persona</label>
              <select id="apptVersionSelect" class="form-control" onchange="window.AppointmentModal.onVersionChange(this.value)">
                ${op.versions.map(v => `
                  <option value="${v.versionId}" ${v.versionId === ver.versionId ? 'selected' : ''}>
                    ${op.name} — ${v.versionName} (${v.code})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label"><i class="ti ti-briefcase"></i> Consultation Type</label>
              <select id="apptMeetingTypeSelect" class="form-control">
                <option value="strategic">Strategic Operational Briefing</option>
                <option value="executive">Executive Corporate Consultation</option>
                <option value="humanitarian">Humanitarian Project Planning</option>
                <option value="acoustic">Acoustic & Performance Session</option>
                <option value="technical">Technical Model & Neural Calibration</option>
                <option value="personal">VIP In-Person Orientation</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label"><i class="ti ti-building"></i> Meeting Venue / Chamber</label>
            <select id="apptVenueSelect" class="form-control">
              <option value="hq-alpha">Central Command — Briefing Chamber Alpha</option>
              <option value="hyperion-deck">Hyperion Deck 01 — Executive Officer Lounge</option>
              <option value="et-studio">E.T. Studio Headquarters — Conference Hall B</option>
              <option value="medical-suite">Neo-Elysium Medical Wing — Consultation Suite 4</option>
              <option value="acoustic-dome">Acoustic Dome 07 — VIP Green Room</option>
              <option value="arcology-suite">Central Arcology — VIP Protocol Chamber</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label"><i class="ti ti-calendar"></i> Preferred Meeting Date</label>
              <input type="date" id="apptDateInput" class="form-control" value="${tomorrowStr}" required>
            </div>
            <div class="form-group">
              <label class="form-label"><i class="ti ti-clock"></i> Time Window Slot</label>
              <select id="apptTimeSlotSelect" class="form-control">
                <option value="10:00 - 11:30">10:00 — 11:30 (Morning Briefing)</option>
                <option value="13:30 - 15:00">13:30 — 15:00 (Afternoon Consultation)</option>
                <option value="15:30 - 17:00">15:30 — 17:00 (Peak Strategy Window)</option>
                <option value="18:00 - 19:30">18:00 — 19:30 (Evening Conference)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label"><i class="ti ti-id"></i> Attendee / Visitor Name</label>
              <input type="text" id="apptVisitorNameInput" class="form-control" placeholder="Your Full Name or Rank" value="Commander Nova" required>
            </div>
            <div class="form-group">
              <label class="form-label"><i class="ti ti-shield"></i> Organization / Affiliation</label>
              <input type="text" id="apptOrgInput" class="form-control" placeholder="e.g. Hyperion Command / Civic Foundation" value="Central Command" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label"><i class="ti ti-notes"></i> Meeting Agenda / Discussion Notes</label>
            <textarea id="apptNotesInput" class="form-control" rows="2" placeholder="Briefly specify topics, special requirements, or escort protocols...">Operational coordination and in-person review docket.</textarea>
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
            <button type="button" class="btn btn-outline" onclick="window.AppointmentModal.close()">Cancel</button>
            <button type="submit" class="btn btn-primary btn-lg" style="min-width: 200px;">
              <i class="ti ti-calendar-check"></i> Confirm Appointment
            </button>
          </div>
        </form>
      `;
    },

    onVersionChange(newVersionId) {
      if (!this.currentOperator) return;
      this.currentVersion = this.currentOperator.versions.find(v => v.versionId === newVersionId);
      this.renderForm();
    },

    submitAppointment() {
      const op = this.currentOperator;
      const ver = this.currentVersion;
      const visitor = document.getElementById('apptVisitorNameInput')?.value || 'Guest Commander';
      const org = document.getElementById('apptOrgInput')?.value || 'Affiliated Command';
      const date = document.getElementById('apptDateInput')?.value || 'Upcoming Date';
      const slot = document.getElementById('apptTimeSlotSelect')?.value || '14:00 - 15:30';
      const venueSelect = document.getElementById('apptVenueSelect');
      const venueName = venueSelect ? venueSelect.options[venueSelect.selectedIndex].text : 'Briefing Chamber Alpha';
      const meetingTypeSelect = document.getElementById('apptMeetingTypeSelect');
      const meetingTypeName = meetingTypeSelect ? meetingTypeSelect.options[meetingTypeSelect.selectedIndex].text : 'Consultation';

      const apptId = 'APPT-' + Math.floor(100000 + Math.random() * 900000);
      const clearanceCode = 'SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      const container = document.getElementById('appointmentFormContainer');
      if (!container) return;

      container.innerHTML = `
        <div class="dispatch-receipt-screen">
          <div class="receipt-icon" style="background: #f0fdf4; color: #16a34a;">
            <i class="ti ti-calendar-check"></i>
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 6px;">Appointment Confirmed!</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Your direct in-person meeting pass has been verified and registered with security escort.</p>

          <div class="receipt-card" style="margin: 20px auto; text-align: left; line-height: 1.9; font-size: 0.85rem;">
            <div>--------------------------------------------------</div>
            <div><strong>PROJECT MAIDEN — IN-PERSON APPOINTMENT DOCKET</strong></div>
            <div>--------------------------------------------------</div>
            <div>APPOINTMENT PASS : <strong>${apptId}</strong></div>
            <div>SECURITY CLEARANCE: <strong>${clearanceCode}</strong></div>
            <div>OPERATOR         : <strong>${op.name} (${ver.versionName})</strong></div>
            <div>ATTENDEE         : <strong>${visitor}</strong></div>
            <div>ORGANIZATION     : ${org}</div>
            <div>DATE & TIME      : <strong>${date} | ${slot}</strong></div>
            <div>VENUE / CHAMBER  : ${venueName}</div>
            <div>MEETING PURPOSE  : ${meetingTypeName}</div>
            <div>STATUS           : <span style="color: #16a34a; font-weight: bold;">REGISTERED & CONFIRMED</span></div>
            <div>--------------------------------------------------</div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 6px;">
              * Note: Please present this appointment pass to the security checkpoint 10 minutes prior to meeting time. Escort protocol will receive you at arrival.
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline" onclick="window.AppointmentModal.open(window.AppointmentModal.currentOperator)">
              <i class="ti ti-calendar-plus"></i> Schedule Another
            </button>
            <button type="button" class="btn btn-primary" onclick="window.AppointmentModal.close()">
              <i class="ti ti-check"></i> Done & Return
            </button>
          </div>
        </div>
      `;
    },

    bindEvents() {
      const closeBtn = document.getElementById('closeAppointmentModal');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      if (this.modalEl) {
        this.modalEl.addEventListener('click', (e) => {
          if (e.target === this.modalEl) this.close();
        });
      }
    }
  };

  window.AppointmentModal = AppointmentModal;
})();
