const TG = "uz_702"; // ⚠️ Telegram username (boshida @ belgisiz)
let lang = "ru",
  step = 0,
  answers = {};

const T = {
  ru: {
    next: "Далее",
    back: "Назад",
    send: "Отправить бриф",
    done_title: "Готово!",
    done_sub: "Отправьте бриф дизайнеру",
    tg_btn: "Открыть чат с дизайнером",
    tg_note: "Вставьте текст в чат и нажмите отправить",
    hint: "Нажмите для выбора · Pinterest откроет примеры",
    pin: "Примеры →",
    sel: "Выберите",
    header: "📋 БРИФ DESIGN",
    steps: ["Знакомство", "Объект", "Стиль", "Пожелания", "Бюджет"],
    subtitles: [
      "Расскажите немного о себе",
      "Опишите ваш объект",
      "Какой стиль вам близок?",
      "Что для вас важно?",
      "Бюджет и сроки",
    ],
  },
  uz: {
    next: "Keyingi",
    back: "Orqaga",
    send: "Briefni yuborish",
    done_title: "Tayyor!",
    done_sub: "Briefni dizaynerga yuboring",
    tg_btn: "Dizayner bilan chatni ochish",
    tg_note: "Matnni chatga joylang va yuborishni bosing",
    hint: "Tanlash uchun bosing · Pinterest misollarni ochadi",
    pin: "Misollar →",
    sel: "Tanlang",
    header: "📋 DESIGN BRIEF",
    steps: ["Tanishuv", "Ob'ekt", "Uslub", "Istaklar", "Byudjet"],
    subtitles: [
      "O'zingiz haqingizda",
      "Ob'ektingizni tasvirlab bering",
      "Qanday uslub yoqadi?",
      "Siz uchun nima muhim?",
      "Byudjet va muddatlar",
    ],
  },
};

const STEPS = [
  {
    icon: "👋",
    questions: [
      {
        id: "name",
        label: { ru: "Ваше имя", uz: "Ismingiz" },
        type: "text",
        ph: { ru: "Имя", uz: "Ism" },
        req: true,
      },
      {
        id: "phone",
        label: { ru: "Телефон", uz: "Telefon" },
        type: "phone",
        ph: { ru: "+998", uz: "+998" },
        req: true,
      },
      {
        id: "city",
        label: { ru: "Город", uz: "Shahar" },
        type: "text",
        ph: { ru: "Город", uz: "Shahar" },
        req: true,
      },
    ],
  },
  {
    icon: "🏠",
    questions: [
      {
        id: "obj_type",
        label: { ru: "Тип объекта", uz: "Ob'ekt turi" },
        type: "select",
        options: {
          ru: [
            "Квартира",
            "Дом / Коттедж",
            "Апартаменты",
            "Офис",
            "Коммерческое",
          ],
          uz: ["Kvartira", "Uy / Kottedj", "Apartamentlar", "Ofis", "Tijorat"],
        },
      },
      {
        id: "rooms",
        label: { ru: "Комнат", uz: "Xonalar" },
        type: "select",
        options: {
          ru: ["Студия", "1", "2", "3", "4+"],
          uz: ["Studiya", "1", "2", "3", "4+"],
        },
      },
      {
        id: "area",
        label: { ru: "Площадь (м²)", uz: "Maydon (m²)" },
        type: "text",
        ph: { ru: "75", uz: "75" },
        req: true,
      },
      {
        id: "stage",
        label: { ru: "Состояние", uz: "Holat" },
        type: "select",
        options: {
          ru: ["Черновая", "Вторичка (ремонт)", "Есть ремонт", "Новостройка"],
          uz: ["Qo'pol", "Ikkilamchi", "Ta'mirlash bor", "Yangi bino"],
        },
      },
    ],
  },
  {
    icon: "🎨",
    questions: [
      {
        id: "style",
        label: { ru: "Стиль интерьера", uz: "Interior uslubi" },
        type: "style_cards",
      },
      {
        id: "palette",
        label: { ru: "Цветовая палитра", uz: "Rang palitasi" },
        type: "palette_cards",
      },
      {
        id: "refs",
        label: { ru: "Ссылки на вдохновение", uz: "Ilhom manbalari" },
        type: "text",
        ph: { ru: "Pinterest, Instagram…", uz: "Pinterest, Instagram…" },
      },
    ],
  },
  {
    icon: "✨",
    questions: [
      {
        id: "priority",
        label: { ru: "Что важнее всего?", uz: "Eng muhimi?" },
        type: "chips",
        options: {
          ru: [
            "Функциональность",
            "Эстетика",
            "Хранение",
            "Свет",
            "Зонирование",
            "Уют",
            "Статус",
          ],
          uz: [
            "Funksionallik",
            "Estetika",
            "Saqlash",
            "Yorug'lik",
            "Zonalash",
            "Qulaylik",
            "Nufuz",
          ],
        },
      },
      {
        id: "residents",
        label: { ru: "Кто живёт / работает", uz: "Kim yashaydi" },
        type: "text",
        ph: { ru: "Пара + ребёнок + кот", uz: "Juft + bola + mushuk" },
        req: true,
      },
      {
        id: "special",
        label: { ru: "Особые пожелания", uz: "Maxsus talablar" },
        type: "textarea",
        ph: { ru: "Аллергия, хобби, питомцы…", uz: "Allergiya, hobbi…" },
      },
    ],
  },
  {
    icon: "💰",
    questions: [
      {
        id: "budget",
        label: { ru: "Бюджет", uz: "Byudjet" },
        type: "select",
        options: {
          ru: [
            "До 10 млн сум",
            "10–30 млн",
            "30–70 млн",
            "70–150 млн",
            "От 150 млн",
            "Не определился",
          ],
          uz: [
            "10 mlngacha",
            "10–30 mln",
            "30–70 mln",
            "70–150 mln",
            "150 mlndan",
            "Aniqlanmagan",
          ],
        },
      },
      {
        id: "deadline",
        label: { ru: "Сроки", uz: "Muddat" },
        type: "select",
        options: {
          ru: ["1–2 месяца", "3–4 месяца", "6 месяцев", "Год+", "Без рамок"],
          uz: ["1–2 oy", "3–4 oy", "6 oy", "1 yil+", "Muddat yo'q"],
        },
      },
      {
        id: "scope",
        label: { ru: "Задача дизайнера", uz: "Dizayner vazifasi" },
        type: "chips",
        options: {
          ru: ["Только проект", "Проект + надзор", "Проект + ремонт"],
          uz: ["Faqat loyiha", "Loyiha + nazorat", "Loyiha + ta'mirlash"],
        },
      },
      {
        id: "comments",
        label: { ru: "Комментарии", uz: "Izohlar" },
        type: "textarea",
        ph: { ru: "Всё остальное…", uz: "Qolgan hamma narsa…" },
      },
    ],
  },
];

const STYLES = [
  {
    key: "minimalism",
    emoji: "◻",
    label: { ru: "Минимализм", uz: "Minimalizm" },
    desc: { ru: "Чисто, без лишнего", uz: "Toza, minimum" },
    q: "minimalism interior",
  },
  {
    key: "modern",
    emoji: "◈",
    label: { ru: "Современный", uz: "Zamonaviy" },
    desc: { ru: "Актуально", uz: "Dolzarb" },
    q: "modern interior design",
  },
  {
    key: "scandinavian",
    emoji: "❄",
    label: { ru: "Скандинавский", uz: "Skandinaviya" },
    desc: { ru: "Светло и уютно", uz: "Yorug' va qulay" },
    q: "scandinavian interior",
  },
  {
    key: "loft",
    emoji: "⚙",
    label: { ru: "Лофт", uz: "Loft" },
    desc: { ru: "Открыто и сыро", uz: "Ochiq va xom" },
    q: "loft interior design",
  },
  {
    key: "classic",
    emoji: "🏛",
    label: { ru: "Классика", uz: "Klassika" },
    desc: { ru: "Роскошь", uz: "Hashamat" },
    q: "classic interior design",
  },
  {
    key: "neoclassic",
    emoji: "◎",
    label: { ru: "Неоклассика", uz: "Neoklassika" },
    desc: { ru: "Классика+", uz: "Klassika+" },
    q: "neoclassic interior",
  },
  {
    key: "japanese",
    emoji: "⛩",
    label: { ru: "Японский", uz: "Yapon" },
    desc: { ru: "Дзен", uz: "Zen" },
    q: "japanese interior design",
  },
  {
    key: "contemporary",
    emoji: "◇",
    label: { ru: "Контемпорари", uz: "Kontemporari" },
    desc: { ru: "Без рамок", uz: "Erkin" },
    q: "contemporary interior",
  },
  {
    key: "eclectic",
    emoji: "✦",
    label: { ru: "Эклектика", uz: "Eklektika" },
    desc: { ru: "Смешение стилей", uz: "Aralash uslub" },
    q: "eclectic interior design",
  },
  {
    key: "undefined",
    emoji: "🤔",
    label: { ru: "Не знаю", uz: "Bilmadim" },
    desc: { ru: "Дизайнер поможет", uz: "Dizayner yordam beradi" },
    q: null,
  },
];

const PALETTES = [
  {
    key: "light",
    label: { ru: "Светлая", uz: "Yorug'" },
    colors: ["#f5f0eb", "#e8e0d5", "#d4c9bb"],
  },
  {
    key: "dark",
    label: { ru: "Тёмная", uz: "To'q" },
    colors: ["#1a1a2e", "#16213e", "#0f3460"],
  },
  {
    key: "warm",
    label: { ru: "Тёплая / земляная", uz: "Iliq / tuproq" },
    colors: ["#c9956c", "#a67c52", "#8b5e3c"],
  },
  {
    key: "cold",
    label: { ru: "Холодная", uz: "Sovuq" },
    colors: ["#b0bec5", "#90a4ae", "#607d8b"],
  },
  {
    key: "bright",
    label: { ru: "Яркие акценты", uz: "Yorqin aksent" },
    colors: ["#e53935", "#f9a825", "#1e88e5"],
  },
  {
    key: "mono",
    label: { ru: "Монохром", uz: "Monoxrom" },
    colors: ["#f5f5f5", "#9e9e9e", "#212121"],
  },
];

function formatPhone(r) {
  r = r.replace(/\D/g, "");
  if (!r.startsWith("998")) r = "998" + r;
  r = r.slice(0, 12);
  let f = "+998";
  if (r.length > 3) f += " " + r.slice(3, 5);
  if (r.length > 5) f += " " + r.slice(5, 8);
  if (r.length > 8) f += " " + r.slice(8, 10);
  if (r.length > 10) f += " " + r.slice(10, 12);
  return f;
}

function toggleKey(id, i) {
  const a = answers[id] || [];
  answers[id] = a.includes(i) ? a.filter((x) => x !== i) : [...a, i];
  render();
}

function canGo() {
  return STEPS[step].questions.every((q) => {
    if (!q.req) return true;
    const v = answers[q.id];
    return v && v.toString().trim() !== "";
  });
}

function getVal(q, raw) {
  if (
    raw === undefined ||
    raw === null ||
    (Array.isArray(raw) && !raw.length) ||
    raw === ""
  )
    return null;
  if (q.type === "select") {
    const i = parseInt(raw);
    return isNaN(i) ? raw : q.options[lang][i] || raw;
  }
  if (q.type === "chips")
    return raw
      .map((i) => {
        const x = parseInt(i);
        return isNaN(x) ? i : q.options[lang][x] || i;
      })
      .join(", ");
  if (q.type === "style_cards")
    return raw
      .map((i) => {
        const x = parseInt(i);
        return isNaN(x) ? i : STYLES[x] ? STYLES[x].label[lang] : i;
      })
      .join(", ");
  if (q.type === "palette_cards")
    return raw
      .map((i) => {
        const x = parseInt(i);
        return isNaN(x) ? i : PALETTES[x] ? PALETTES[x].label[lang] : i;
      })
      .join(", ");
  return raw;
}

function setLang(l) {
  lang = l;
  document
    .querySelectorAll(".lang-btn")
    .forEach((b) =>
      b.classList.toggle("active", b.textContent === l.toUpperCase()),
    );
  render();
}

function render() {
  const L = T[lang];
  const s = STEPS[step];

  // progress
  document.getElementById("progressFill").style.width =
    `${((step + 1) / STEPS.length) * 100}%`;
  document.getElementById("stepPill").textContent =
    `${step + 1} / ${STEPS.length}`;
  document.getElementById("stepLabels").innerHTML = L.steps
    .map((lbl, i) => {
      let cls =
        "step-label" + (i === step ? " active" : i < step ? " done" : "");
      return `<span class="${cls}">${lbl}</span>`;
    })
    .join("");

  let html = `<div class="card">
    <div class="card-hero">
      <div class="card-step-tag">${s.icon} ${L.steps[step]}</div>
      <div class="card-title">${L.subtitles[step]}</div>
    </div>
    <div class="questions">`;

  s.questions.forEach((q) => {
    html += `<div class="field"><label class="field-label">${q.label[lang]}</label>`;

    if (q.type === "text" || q.type === "phone") {
      const v = (answers[q.id] || "").replace(/"/g, "&quot;");
      const inputMode =
        q.id === "area" || q.type === "phone" ? 'inputmode="numeric"' : "";
      html += `<input type="text" ${inputMode} placeholder="${q.ph[lang]}" value="${v}" oninput="hi('${q.id}','${q.type}',this.value)">`;
    } else if (q.type === "textarea") {
      html += `<textarea placeholder="${q.ph[lang]}" oninput="hi('${q.id}','text',this.value)" rows="3">${answers[q.id] || ""}</textarea>`;
    } else if (q.type === "select") {
      const sv = answers[q.id];
      html += `<select onchange="hi('${q.id}','select',this.value)"><option value="">${L.sel}…</option>`;
      q.options[lang].forEach((o, i) => {
        html += `<option value="${i}"${sv === String(i) || sv === i ? " selected" : ""}>${o}</option>`;
      });
      html += `</select>`;
    } else if (q.type === "chips") {
      const sel = answers[q.id] || [];
      html += `<div class="chips">`;
      q.options[lang].forEach((o, i) => {
        const a = sel.includes(i) || sel.includes(String(i));
        html += `<button class="chip${a ? " active" : ""}" onclick="toggleKey('${q.id}',${i})">${o}</button>`;
      });
      html += `</div>`;
    } else if (q.type === "style_cards") {
      const sel = answers[q.id] || [];
      html += `<p class="hint">${L.hint}</p><div class="style-grid">`;
      STYLES.forEach((o, i) => {
        const a = sel.includes(i) || sel.includes(String(i));
        html += `<div class="style-card${a ? " active" : ""}" onclick="toggleKey('${q.id}',${i})">
          <div class="style-card-top">${o.emoji}</div>
          <div class="style-card-body">
            <div class="style-card-name">${o.label[lang]}${a ? '<span class="check">✓</span>' : ""}
            </div>
            <div class="style-card-desc">${o.desc[lang]}</div>
          </div>
          ${o.q ? `<div class="pin-wrap"><button class="pin-btn" onclick="event.stopPropagation();window.open('https://pinterest.com/search/pins/?q=${encodeURIComponent(o.q)}','_blank')">${L.pin}</button></div>` : ""}
        </div>`;
      });
      html += `</div>`;
    } else if (q.type === "palette_cards") {
      const sel = answers[q.id] || [];
      html += `<div class="palette-grid">`;
      PALETTES.forEach((o, i) => {
        const a = sel.includes(i) || sel.includes(String(i));
        const sw = o.colors
          .map((c) => `<div class="swatch" style="background:${c}"></div>`)
          .join("");
        html += `<div class="palette-card${a ? " active" : ""}" onclick="toggleKey('${q.id}',${i})">
          <div class="swatches">${sw}</div>
          <div class="palette-name">${o.label[lang]}${a ? '<span class="check">✓</span>' : ""}
          </div>
        </div>`;
      });
      html += `</div>`;
    }
    html += `</div>`;
  });

  html += `</div><div class="nav">`;
  if (step > 0)
    html += `<button class="btn-back" onclick="goBack()">${L.back}</button>`;
  if (step < STEPS.length - 1) {
    html += `<button class="btn-next" onclick="goNext()"${canGo() ? "" : " disabled"}>${L.next}</button>`;
  } else {
    html += `<button class="btn-next" onclick="submitForm()">${L.send}</button>`;
  }
  html += `</div></div>`;
  document.getElementById("root").innerHTML = html;
}

function hi(id, type, val) {
  if (type === "phone") {
    val = formatPhone(val);
  } else if (id === "area") {
    val = val.replace(/\D/g, "");
  }

  answers[id] = val;

  const input = document.querySelector(`input[oninput*="'${id}'"]`);
  if (input) input.value = val;

  const btn = document.querySelector(".btn-next");
  if (btn) btn.disabled = !canGo();
}

function goNext() {
  if (canGo()) {
    step++;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
function goBack() {
  step--;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 📌 Ultra-ixcham matn generatsiyasi (Telefon cheklovlaridan o'tish uchun)
function buildText() {
  const L = T[lang];
  let lines = [`${L.header}`];

  STEPS.forEach((s) => {
    s.questions.forEach((q) => {
      const v = getVal(q, answers[q.id]);
      if (v) {
        // Ortiqcha "Имя:", "Телефон:" so'zlarisiz faqat qisqa belgi bilan yozadi
        lines.push(`• ${q.label[lang]}: ${v}`);
      }
    });
  });

  return lines.join("\n");
}

function sendTG() {
  const text = buildText();
  const encoded = encodeURIComponent(text);

  // Clipboard ga ham saqlab qo'yamiz (zapas)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  } else {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch(e) {}
    document.body.removeChild(ta);
  }

  // t.me/username?text=... — brauzerda ochilsa matn bilan keladi
  const url = "https://t.me/" + TG + "?text=" + encoded;
  
  // <a> element orqali ochish — Telegram ilovasini bypass qilib brauzerda ochadi
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function copyText() {
  const text = buildText();
  const btn = document.getElementById("copyBtn");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) { btn.textContent = "✅ Скопировано!"; setTimeout(() => { btn.textContent = "📋 Скопировать текст"; }, 2000); }
    }).catch(() => fallbackCopy(text, btn));
  } else {
    fallbackCopy(text, btn);
  }
}

function fallbackCopy(text, btn) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    if (btn) { btn.textContent = "✅ Скопировано!"; setTimeout(() => { btn.textContent = "📋 Скопировать текст"; }, 2000); }
  } catch(e) {}
  document.body.removeChild(ta);
}

function submitForm() {
  const L = T[lang];
  let rows = "";
  STEPS.forEach((s) =>
    s.questions.forEach((q) => {
      const v = getVal(q, answers[q.id]);
      if (v)
        rows += `<div class="summary-row"><span class="summary-label">${q.label[lang]}</span><span class="summary-val">${v}</span></div>`;
    }),
  );

  document.getElementById(
    "progressFill",
  ).parentElement.parentElement.style.opacity = "0";
  document.querySelector(".topbar").style.display = "none";

  const briefText = buildText();

  document.getElementById("root").innerHTML = `
    <div class="done-wrap">
      <div class="done-top">
        <div class="done-icon">✅</div>
        <div class="done-title">${L.done_title}</div>
        <div class="done-sub">${L.done_sub}</div>
      </div>
      <div class="summary-box">${rows}</div>
      <div class="done-footer">
        <div class="brief-preview">${briefText.replace(/\n/g, "<br>")}</div>
        <button id="copyBtn" class="copy-btn" onclick="copyText()">📋 ${lang === 'uz' ? 'Nusxa olish' : 'Скопировать текст'}</button>
        <button class="tg-btn" onclick="sendTG()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.93 6.77l-1.9 8.96c-.14.62-.5.77-.99.48l-2.75-2.03-1.33 1.28c-.15.15-.27.27-.55.27l.2-2.77 5.02-4.54c.22-.19-.05-.3-.33-.11l-6.21 3.91-2.67-.84c-.58-.18-.59-.58.12-.86l10.44-4.02c.48-.18.9.11.75.27z"/></svg>
          ${L.tg_btn}
        </button>
        <p class="tg-note">${lang === 'uz' ? 'Matn nusxa olindi — chatga joylashtiring va yuboring' : 'Текст скопирован — вставьте в чат и отправьте'}</p>
      </div>
    </div>`;
}

render();
