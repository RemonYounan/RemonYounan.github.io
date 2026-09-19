/* ==========================================================================
   Contact modal
   Every "Start your project" / "Let's talk" / "Start a project" CTA opens this
   instead of jumping straight to a mail client. The buttons keep their mailto
   href, so without JS the site behaves exactly as it did before.

   Sending: if C.formEndpoint is set (Formspree, Getform, Basin, your own
   handler) the form POSTs there in the background. With no endpoint the form
   hands the filled-in message to the visitor's mail app. Either way the
   WhatsApp button carries the same message across.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var has = function (v) { return v !== undefined && v !== null && v !== ""; };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  // CTAs that open the modal. `.cta-panel .btn--gold` catches the case-study
  // CTA, which main.js renders after this script runs — hence delegation.
  var TRIGGERS = "[data-open-contact],[data-hero-primary],[data-contact-cta],[data-nav-cta],.cta-panel .btn--gold";

  var WA_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.02 8.02 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.1 8.09a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.03 8.03 0 0 1-1.24-4.3c0-4.46 3.63-8.09 8.1-8.09Zm4.68 10.29c-.06-.11-.24-.18-.5-.31-.26-.13-1.54-.76-1.78-.85-.24-.09-.42-.13-.6.13-.18.26-.68.85-.83 1.03-.15.18-.31.2-.57.07-.26-.13-1.09-.4-2.08-1.28-.77-.69-1.29-1.53-1.44-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.16.17-.26.26-.44.09-.18.04-.33-.02-.46-.06-.13-.6-1.45-.83-1.98-.22-.52-.44-.45-.6-.46l-.51-.01c-.18 0-.46.07-.7.33-.24.26-.92.9-.92 2.2 0 1.3.94 2.55 1.07 2.73.13.18 1.85 2.82 4.48 3.96.63.27 1.11.43 1.49.55.63.2 1.2.17 1.65.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24Z"/></svg>';
  var MAIL_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>';
  var CLOSE_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var CHECK_ICON = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  var modal = null;
  var panel = null;
  var lastFocus = null;

  /* ---------------------------------------------------------------- build */
  function build() {
    var waHref = has(C.whatsapp) ? "https://wa.me/" + C.whatsapp : "";
    var mailHref = has(C.email) ? "mailto:" + C.email : "";

    var el = document.createElement("div");
    el.className = "modal";
    el.setAttribute("data-contact-modal", "");
    el.hidden = true;
    el.innerHTML =
      '<button class="modal__backdrop" type="button" data-modal-close tabindex="-1" aria-hidden="true"></button>' +
      '<div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="cm-title">' +
        '<button class="modal__close" type="button" data-modal-close aria-label="Close">' + CLOSE_ICON + "</button>" +
        '<span class="eyebrow">Start your project</span>' +
        '<h2 id="cm-title">Tell me what you\'re building.</h2>' +
        '<p class="modal__lede">' +
          esc(has(C.contactText) ? C.contactText : "Tell me what you're making and I'll come back with what it will take, usually within 24 hours.") +
        "</p>" +
        '<form class="cm-form" novalidate data-cm-form>' +
          '<div class="cm-field">' +
            '<label for="cm-name">Your name</label>' +
            '<input id="cm-name" name="name" type="text" autocomplete="name" placeholder="John Doe" required aria-describedby="cm-name-err" />' +
            '<p class="cm-error" id="cm-name-err"></p>' +
          "</div>" +
          // Either channel will do, so neither field is required on its own —
          // the pair is. The hint says so before the visitor finds out by
          // being told off.
          '<p class="cm-hint" id="cm-reach-hint">Leave me one way to reply: email, phone, or both.</p>' +
          '<div class="cm-row">' +
            '<div class="cm-field">' +
              '<label for="cm-email">Email</label>' +
              '<input id="cm-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="john.doe@example.com" aria-describedby="cm-email-err cm-reach-hint cm-reach-err" />' +
              '<p class="cm-error" id="cm-email-err"></p>' +
            "</div>" +
            '<div class="cm-field">' +
              '<label for="cm-phone">Phone</label>' +
              '<input id="cm-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+1 555 123 4567" aria-describedby="cm-phone-err cm-reach-hint cm-reach-err" />' +
              '<p class="cm-error" id="cm-phone-err"></p>' +
            "</div>" +
          "</div>" +
          '<p class="cm-error" id="cm-reach-err" data-cm-reacherror></p>' +
          '<div class="cm-field">' +
            '<label for="cm-msg">What are you building? <span>(a few lines is plenty)</span></label>' +
            '<textarea id="cm-msg" name="message" placeholder="A booking app for barbershops. Customers pick a time, the shop confirms. I have the designs, nothing built yet." required aria-describedby="cm-msg-err"></textarea>' +
            '<p class="cm-error" id="cm-msg-err"></p>' +
          "</div>" +
          '<p class="cm-error" data-cm-formerror></p>' +
          '<div class="cm-actions">' +
            '<button class="btn btn--gold" type="submit" data-cm-submit>' + MAIL_ICON + "<span>Send it over</span></button>" +
            (waHref
              ? '<a class="btn btn--ghost cm-wa" href="' + esc(waHref) + '" target="_blank" rel="noopener" data-cm-wa>' + WA_ICON + "Chat on WhatsApp</a>"
              : "") +
          "</div>" +
        "</form>" +
        (mailHref
          ? '<p class="cm-note">Or email me directly: <a href="' + esc(mailHref) + '">' + esc(C.email) + "</a></p>"
          : "") +
      "</div>";

    document.body.appendChild(el);
    modal = el;
    panel = el.querySelector(".modal__panel");

    el.addEventListener("click", function (e) {
      if (e.target.closest("[data-modal-close]")) close();
    });
    el.querySelector("[data-cm-form]").addEventListener("submit", submit);

    // The WhatsApp button carries whatever is typed so far, so a visitor who
    // prefers WhatsApp never retypes the message.
    var wa = el.querySelector("[data-cm-wa]");
    if (wa) {
      wa.addEventListener("click", function () {
        wa.setAttribute("href", waHref + "?text=" + encodeURIComponent(waText()));
      });
    }
    return el;
  }

  /* ------------------------------------------------------------- messages */
  function val(id) {
    var el = modal.querySelector(id);
    return el ? (el.value || "").trim() : "";
  }

  function values() {
    return {
      name: val("#cm-name"),
      email: val("#cm-email"),
      phone: val("#cm-phone"),
      message: val("#cm-msg")
    };
  }

  // "email, phone" / "email" / "phone" — whichever the visitor left.
  function reachLine(v) {
    var out = [];
    if (v.email) out.push(v.email);
    if (v.phone) out.push(v.phone);
    return out.join(" · ");
  }

  function waText() {
    var v = values();
    var out = "Hi " + (has(C.name) ? C.name.split(" ")[0] : "there") + ", ";
    out += v.name ? "I'm " + v.name + ". " : "";
    out += v.message || "I'd like to talk about an app I'm planning.";
    var reach = reachLine(v);
    if (reach) out += "\n\nYou can reach me at " + reach + ".";
    return out;
  }

  function mailtoHref() {
    var v = values();
    var subject = "New project: " + (v.name || "an app idea");
    var body =
      v.message + "\n\n" +
      "— " + v.name + "\n" +
      reachLine(v);
    return "mailto:" + C.email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  /* ----------------------------------------------------------- validation */
  function fieldError(input, msg) {
    // aria-describedby can list the hint too, so the error box is the first id.
    var box = document.getElementById((input.getAttribute("aria-describedby") || "").split(" ")[0]);
    if (box) box.textContent = msg || "";
    if (msg) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    return !msg;
  }

  function validate() {
    var name = modal.querySelector("#cm-name");
    var email = modal.querySelector("#cm-email");
    var phone = modal.querySelector("#cm-phone");
    var msg = modal.querySelector("#cm-msg");
    var reachErr = modal.querySelector("[data-cm-reacherror]");
    var ok = true;
    var first = null;

    function check(input, message) {
      if (fieldError(input, message)) return;
      ok = false;
      first = first || input;
    }

    check(name, name.value.trim() ? "" : "Please add your name.");

    // Email and phone are each optional, but one of the two has to be there —
    // otherwise there's a message with no way to answer it.
    var mail = email.value.trim();
    var tel = phone.value.trim();
    check(email, !mail || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail) ? "" : "That email doesn't look right.");
    check(phone, !tel || (/^\+?[\d\s().-]+$/.test(tel) && tel.replace(/\D/g, "").length >= 7) ? "" : "That phone number doesn't look right.");

    if (!mail && !tel) {
      reachErr.textContent = "Add an email or a phone number so I can reply.";
      email.setAttribute("aria-invalid", "true");
      phone.setAttribute("aria-invalid", "true");
      ok = false;
      first = first || email;
    } else {
      reachErr.textContent = "";
    }

    check(msg, msg.value.trim() ? "" : "Tell me a little about the project.");

    if (first) first.focus();
    return ok;
  }

  /* --------------------------------------------------------------- submit */
  function submit(e) {
    e.preventDefault();
    if (!validate()) return;

    var form = modal.querySelector("[data-cm-form]");
    var formError = modal.querySelector("[data-cm-formerror]");
    formError.textContent = "";

    // No endpoint configured: hand the finished message to the mail app.
    if (!has(C.formEndpoint)) {
      if (has(C.email)) window.location.href = mailtoHref();
      done("mail");
      return;
    }

    var btn = modal.querySelector("[data-cm-submit]");
    form.setAttribute("data-busy", "true");
    btn.querySelector("span").textContent = "Sending…";

    var v = values();
    fetch(C.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: v.name, email: v.email, phone: v.phone, message: v.message })
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed: " + res.status);
        done("sent");
      })
      .catch(function () {
        form.removeAttribute("data-busy");
        btn.querySelector("span").textContent = "Send it over";
        formError.textContent = has(C.email)
          ? "That didn't go through. Try WhatsApp, or email me at " + C.email + "."
          : "That didn't go through. Try WhatsApp instead.";
      });
  }

  function done(mode) {
    var waHref = has(C.whatsapp) ? "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(waText()) : "";
    panel.querySelector("[data-cm-form]").remove();
    var note = panel.querySelector(".cm-note");
    if (note) note.remove();
    panel.querySelector(".eyebrow").remove();
    panel.querySelector("#cm-title").remove();
    panel.querySelector(".modal__lede").remove();

    var wrap = document.createElement("div");
    wrap.className = "cm-done";
    wrap.innerHTML =
      '<div class="cm-done__mark">' + CHECK_ICON + "</div>" +
      '<h3 id="cm-title">' + (mode === "sent" ? "Message sent." : "Your mail app is open.") + "</h3>" +
      "<p>" +
        (mode === "sent"
          ? "Thanks. I read everything myself and reply within 24 hours."
          : "Send the message that's waiting there and I'll reply within 24 hours. Prefer WhatsApp? It's one tap below.") +
      "</p>" +
      (waHref ? '<a class="btn btn--ghost cm-wa" href="' + esc(waHref) + '" target="_blank" rel="noopener">' + WA_ICON + "Chat on WhatsApp</a>" : "");
    panel.appendChild(wrap);
    var next = panel.querySelector(".cm-done .btn") || panel.querySelector("[data-modal-close]");
    if (next) next.focus();
  }

  /* ---------------------------------------------------------- open/close */
  function open(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    if (!modal) build();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var first = modal.querySelector("#cm-name") || modal.querySelector("[data-modal-close]");
    if (first) first.focus();
    document.addEventListener("keydown", onKey);
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    // A dialog showing the "sent" state has had its form removed, so it is
    // thrown away and rebuilt fresh the next time a CTA is clicked.
    if (panel.querySelector(".cm-done")) {
      modal.remove();
      modal = null;
      panel = null;
    }
  }

  function onKey(e) {
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    // Keep focus inside the dialog while it's open.
    var f = panel.querySelectorAll('a[href],button:not([tabindex="-1"]),input,textarea,select');
    if (!f.length) return;
    var first = f[0];
    var last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ------------------------------------------------------------------ go */
  document.addEventListener("click", function (e) {
    var t = e.target.closest(TRIGGERS);
    if (!t || t.hasAttribute("data-no-modal")) return;
    open(e);
  });

  window.openContactModal = open;
})();
