const revealNodes = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  },
);

revealNodes.forEach((node) => revealObserver.observe(node));

const navToggle = document.getElementById("nav-toggle");
const nav = document.getElementById("site-nav");

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const accordionRoots = document.querySelectorAll("[data-accordion]");
let accordionMobile = window.innerWidth <= 760;

accordionRoots.forEach((root, rootIndex) => {
  const items = Array.from(root.querySelectorAll("[data-accordion-item]"));
  const desktopSingle = root.dataset.accordionDesktop === "single";

  const setAccordionItemState = (item, isOpen) => {
    const toggle = item.querySelector("[data-accordion-toggle]");
    const panel = item.querySelector("[data-accordion-panel]");

    if (!toggle || !panel) {
      return;
    }

    item.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    panel.hidden = !isOpen;
  };

  items.forEach((item, itemIndex) => {
    const toggle = item.querySelector("[data-accordion-toggle]");
    const panel = item.querySelector("[data-accordion-panel]");

    if (!toggle || !panel) {
      return;
    }

    const panelId = panel.id || `accordion-panel-${rootIndex + 1}-${itemIndex + 1}`;
    panel.id = panelId;
    toggle.setAttribute("aria-controls", panelId);
  });

  const initialItemIndex = Math.max(
    items.findIndex((item) => item.classList.contains("is-open")),
    0,
  );
  root.dataset.accordionActiveIndex = String(initialItemIndex);

  root.syncAccordionState = (isMobile) => {
    if (!items.length) {
      return;
    }

    if (!isMobile && !desktopSingle) {
      items.forEach((item) => {
        setAccordionItemState(item, true);
      });
      return;
    }

    const activeIndex = Number(root.dataset.accordionActiveIndex || 0);

    if (Number.isNaN(activeIndex) || activeIndex < 0) {
      items.forEach((item) => {
        setAccordionItemState(item, false);
      });
      return;
    }

    const safeIndex = Math.min(Math.max(activeIndex, 0), items.length - 1);

    items.forEach((item, index) => {
      setAccordionItemState(item, index === safeIndex);
    });
  };

  items.forEach((item, itemIndex) => {
    const toggle = item.querySelector("[data-accordion-toggle]");

    toggle?.addEventListener("click", () => {
      if (!accordionMobile && !desktopSingle) {
        return;
      }

      if (item.classList.contains("is-open")) {
        root.dataset.accordionActiveIndex = "-1";
        root.syncAccordionState(true);
        return;
      }

      root.dataset.accordionActiveIndex = String(itemIndex);
      root.syncAccordionState(true);
    });
  });

  root.syncAccordionState(accordionMobile);
});

window.addEventListener("resize", () => {
  const nextAccordionMobile = window.innerWidth <= 760;

  if (nextAccordionMobile === accordionMobile) {
    return;
  }

  accordionMobile = nextAccordionMobile;
  accordionRoots.forEach((root) => {
    root.syncAccordionState?.(accordionMobile);
  });
});

const trackTabs = document.querySelectorAll("[data-track-tab]");
const trackPanels = document.querySelectorAll("[data-track-panel]");

trackTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const trackId = tab.getAttribute("data-track-tab");

    trackTabs.forEach((item) => item.classList.remove("is-active"));
    trackPanels.forEach((panel) => panel.classList.remove("is-active"));

    tab.classList.add("is-active");
    document
      .querySelector(`[data-track-panel="${trackId}"]`)
      ?.classList.add("is-active");
  });
});

document.querySelectorAll("[data-review-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const card = toggle.closest(".review-card");
    const content = card?.querySelector(".review-card__more");

    if (!content) {
      return;
    }

    const isOpen = !content.hidden;
    content.hidden = isOpen;
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.textContent = isOpen ? "Читать полностью" : "Свернуть";
    pauseReviewSlider();
  });
});

const teacherGrid = document.getElementById("teachers-grid");
const teacherPrevButton = document.querySelector("[data-teachers-prev]");
const teacherNextButton = document.querySelector("[data-teachers-next]");
const teacherProgressFill = document.getElementById("teachers-progress-fill");
const teacherData = [
  {
    id: "parris-shvarts",
    name: "Пэррис Шварц",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "английский",
    cardLanguage: "английский",
    image: "./assets/teachers-all/a3fa1cd877e332c89659088d9bfc9198.JPG",
    details: [
      "12 лет преподавательского опыта",
      "Университет штата Мэн, Преск-Айл — бакалавр английского языка",
      "Cambridge CELTA",
    ],
    bio: [
      "Пэррис начал свой путь в Японии, где во время учёбы работал ассистентом преподавателя.",
      "Позже он продолжил преподавать в школах и детских садах Японии, США, Швейцарии и России.",
    ],
    quote:
      "Park Kultury Nursery стал моим любимым местом работы: здесь у детей и педагогов действительно есть пространство для развития.",
  },
  {
    id: "zhang-yuebo",
    name: "Чжан Юэбо",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "китайский",
    cardLanguage: "китайский",
    image: "./assets/teacher-zhang-yuebo.jpg",
    details: [
      "Российский университет дружбы народов — детский педагог",
      "Преподаёт детям с 2003 года",
    ],
    bio: [
      "Чжан Юэбо имеет большой опыт обучения детей от детского сада до начальной школы и хорошо понимает, как выстраивать раннее языковое погружение.",
      "Собственный опыт переезда из Китая в Москву помогает ей особенно тонко чувствовать путь ребёнка в новом языке.",
    ],
    quote:
      "Имея собственный опыт изучения языка с детства, я стараюсь использовать современные методы, которых когда-то не хватало мне самой.",
  },
  {
    id: "laura-hall",
    name: "Лора Холл",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "английский",
    cardLanguage: "английский",
    image: "./assets/teacher-laura-hall.jpg",
    details: [
      "Университет Шеффилда — современные языки и культуры",
      "Работает с детьми онлайн и офлайн с 2021 года",
    ],
    bio: [
      "После получения степени Лора начала работать с детьми, объединяя языковую подготовку и искреннюю любовь к преподаванию.",
      "Она особенно ценит тёплую атмосферу, в которой ребёнок развивается естественно и без давления.",
    ],
    quote:
      "Наблюдать, как дети растут в такой дружелюбной и гостеприимной атмосфере, — настоящий подарок.",
  },
  {
    id: "li-yan-tze",
    name: "Ли Янь Цзе",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "китайский",
    cardLanguage: "китайский",
    image: "./assets/teacher-li-yan-tze.jpg",
    details: [
      "Преподаёт китайский язык детям с 2020 года",
      "Использует истории, игры и интерактивные форматы",
    ],
    bio: [
      "Ли Янь Цзе приехала из Китая в 2020 году и с тех пор работает с маленькими учениками, создавая на занятиях живую и комфортную атмосферу.",
    ],
    quote:
      "Каждый ребёнок — это уникальное сокровище, и я стремлюсь терпеливо и творчески направлять детей, чтобы они полюбили китайский язык.",
  },
  {
    id: "zhen-jia",
    name: "Жень Цзя",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "китайский",
    cardLanguage: "китайский",
    image: "./assets/teachers-all/d4024cdae5ce398597111bf1fa1497de.jpeg",
    details: [
      "Преподаёт китайский язык детям с 2020 года",
      "Специализируется на пиньине, иероглифах и разговорной практике",
    ],
    bio: [
      "Жень Цзя ведёт занятия в интерактивном формате, используя игры и специальные задания, чтобы вовлекать детей и поддерживать живой темп урока.",
    ],
    quote:
      "Я хочу привить детям любовь к китайскому языку и культуре на всю жизнь через индивидуальный подход и мягкое погружение.",
  },
  {
    id: "jordan-robinson",
    name: "Джордан Робинсон",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "английский",
    cardLanguage: "английский",
    image: "./assets/teachers-all/c7bbd9a7713bb1f7c955be1d0a5399b1.JPG",
    details: [
      "Университет Портсмута — бакалавр английской литературы",
      "Сертифицированный преподаватель TEFL",
      "Несколько лет преподаёт в России детям разных возрастов",
    ],
    bio: [
      "Получив степень по английской литературе и квалификацию TEFL, Джордан переехал в Москву и продолжил работать с детьми на разных уровнях подготовки.",
    ],
    quote:
      "Меня вдохновляет, с каким вниманием в Park Kultury Nursery относятся к развитию каждого ребёнка.",
  },
  {
    id: "olivia-rohman",
    name: "Оливия Рохман",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "английский",
    cardLanguage: "английский",
    image: "./assets/teachers-all/49a0bc741e118146dc1119667ddf5b41.jpg",
    details: [
      "Центральный Вашингтонский университет — современные языки, английский язык и литература",
      "Сертификат TEFL",
      "Более 15 лет в международном образовании",
    ],
    bio: [
      "Оливия преподавала в известных школах Санкт-Петербурга и Москвы, реализуя британскую программу на начальном и дошкольном этапах.",
      "С 2020 года она вносит заметный вклад в развитие сообщества Park Kultury Nursery как учитель с сильной академической и методической базой.",
    ],
    quote:
      "Я стараюсь сделать так, чтобы каждый ребёнок смог полностью раскрыть свой потенциал в эти важные дошкольные годы.",
  },
  {
    id: "liu-meiping",
    name: "Лью Мейпин",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "китайский",
    cardLanguage: "китайский",
    image: "./assets/teachers-all/d7224c932e42ee2535de3763697ba759.webp",
    details: [
      "Во время учёбы в педагогическом колледже работала в школах и детских садах",
      "С раннего этапа строит занятия вокруг живого общения с детьми",
    ],
    bio: [
      "Лью Мейпин родилась и выросла на севере Китая. Ей всегда нравилось работать с детьми, и практика в школах и детских садах помогла ей окончательно выбрать профессию.",
    ],
    quote: "Я очень рада возможности преподавать свой родной язык.",
  },
  {
    id: "james-reid",
    name: "Джеймс Рид",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "английский",
    cardLanguage: "английский",
    image: "./assets/teacher-james-reid.jpg",
    details: [
      "Temple University Japan — бакалавр истории",
      "Open University, Великобритания — исторический факультет",
      "Работает в детских садах Москвы с 2018 года",
    ],
    bio: [
      "После нескольких лет обучения в Японии Джеймс приехал в Москву и начал преподавать в престижных детских садах.",
      "С тех пор он развивает детей внутри сильной англоязычной среды и остаётся частью команды PKN.",
    ],
    quote:
      "PKN для меня — это сильная, сплочённая команда и дети, с которыми хочется расти вместе каждый день.",
  },
  {
    id: "daniel-clark",
    name: "Дэниэль Кларк",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "английский",
    cardLanguage: "английский",
    image: "./assets/teachers-all/e0198458ca43b63a60e4a301e30a2445.JPG",
    details: [
      "Милтон-Кинс, Англия — бакалавр психологии и философии",
      "Сертифицированный преподаватель английского языка (TEFL)",
      "Опыт преподавания в разных странах и работы с детьми",
    ],
    bio: [
      "Дэниэль сочетает гуманитарную и психологическую подготовку с опытом преподавания английского языка детям и ученикам разных возрастов.",
    ],
  },
  {
    id: "jason-moran",
    name: "Джейсон Моран",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "английский",
    cardLanguage: "английский",
    image: "./assets/teachers-all/466830019662e5e419509a2d2567729c.jpg",
    details: [
      "Манчестерский университет Виктории — бакалавр гуманитарных наук",
      "Опыт преподавания по Key Stage 1 и Key Stage 2 в Великобритании",
      "Более 10 лет живёт и работает в Москве",
    ],
    bio: [
      "До переезда в Россию Джейсон работал учителем начальных классов в Великобритании.",
      "В Москве он продолжил преподавать английский взрослым и детям в языковых школах, детских садах и в команде Park Kultury Nursery.",
    ],
    quote:
      "Меня радует, что здесь о детях заботятся по-настоящему глубоко и создают для них комфортную образовательную среду.",
  },
  {
    id: "cristian-aceldas",
    name: "Кристиан Асельдас",
    role: "Ассистент преподавателя",
    nativeLabel: "Родные языки",
    nativeLanguage: "английский / испанский",
    cardLanguage: "английский / испанский",
    image: "./assets/teacher-cristian-aceldas.jpg",
    details: [
      "Университет Хорхе Тадео Лосано — промышленный дизайн",
      "С 2018 года работает с детьми в Москве",
      "Поддерживает творческий и игровой формат занятий",
    ],
    bio: [
      "Кристиан помогает детям чувствовать себя увереннее в англоязычной среде и поддерживает на занятиях энергичную, дружелюбную атмосферу.",
    ],
  },
  {
    id: "natalya-ugryna",
    name: "Наталья Угрына",
    role: "Директор, преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "русский",
    cardLanguage: "русский",
    image: "./assets/teachers-all/natalya-ugryna-color.webp",
    details: [
      "МГПИ им. М. Е. Евсеева — дефектологический факультет",
      "АГПИ — факультет практической психологии",
      "Более 20 лет опыта в образовании",
    ],
    bio: [
      "Наталья имеет два высших образования — дефектологическое и психологическое. С 2003 года ей присвоена высшая квалификационная категория.",
      "Она много лет занимается коррекционно-развивающей работой с детьми, преподавала специальную психологию и руководит дошкольными учреждениями.",
    ],
  },
  {
    id: "irina-matsyuk",
    name: "Ирина Масюк",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "русский",
    cardLanguage: "русский",
    image: "./assets/teacher-irina-matsyuk.jpg",
    details: [
      "Государственный педагогический институт им. Калинина",
      "Благовещенское музыкальное училище — фортепиано",
    ],
    bio: [
      "Ирина считает главной задачей создание доверительной атмосферы, в которой ребёнок учится с интересом и чувствует себя уверенно.",
      "На занятиях она помогает детям раскрывать индивидуальные способности через поддержку, инициативность и ситуацию успеха.",
    ],
    quote:
      "Чтобы быть хорошим преподавателем, нужно любить то, что преподаёшь, и тех, кому преподаёшь.",
  },
  {
    id: "tatyana-kalashnik",
    name: "Татьяна Калашник",
    role: "Преподаватель",
    nativeLabel: "Родной язык",
    nativeLanguage: "русский",
    cardLanguage: "русский",
    image: "./assets/teachers-all/013f8fd6f81a8e81a485eb12fa199a0b.JPG",
    details: [
      "Московский открытый социальный университет — социальная психология",
      "Братское государственное педагогическое училище — дошкольное воспитание",
    ],
    bio: [
      "Для Татьяны важно создать в группе атмосферу тепла и уюта, чтобы каждый ребёнок чувствовал себя защищённым и любимым.",
      "Она много внимания уделяет адаптации, взаимодействию детей друг с другом и тому, чтобы каждый день в саду был ярким и запоминающимся.",
    ],
    quote:
      "Чтобы быть хорошим педагогом, главное — любить то, чему учишь, и тех, кого учишь.",
  },
];

const teacherOrder = [
  "parris-shvarts",
  "zhen-jia",
  "laura-hall",
  "li-yan-tze",
  "zhang-yuebo",
  "jordan-robinson",
  "james-reid",
  "liu-meiping",
  "olivia-rohman",
  "daniel-clark",
  "jason-moran",
  "cristian-aceldas",
  "tatyana-kalashnik",
  "irina-matsyuk",
  "natalya-ugryna",
];

const orderedTeacherData = teacherOrder
  .map((id) => teacherData.find((teacher) => teacher.id === id))
  .filter(Boolean);

const modal = document.getElementById("teacher-modal");
const modalContent = document.getElementById("teacher-modal-content");
const modalWindow = document.getElementById("site-modal-window");
const modalCloseTriggers = document.querySelectorAll("[data-modal-close]");
const spaceSliderTrack = document.getElementById("space-slider-track");
const spacePrevButton = document.querySelector("[data-space-prev]");
const spaceNextButton = document.querySelector("[data-space-next]");
const spaceProgressFill = document.getElementById("space-progress-fill");
const reviewsSliderTrack = document.getElementById("reviews-slider-track");
const reviewsPrevButton = document.querySelector("[data-reviews-prev]");
const reviewsNextButton = document.querySelector("[data-reviews-next]");
const reviewsProgressFill = document.getElementById("reviews-progress-fill");
let teacherSliderTimer;
let activeTeacherSlide = 0;
let teacherPointerStartX = 0;
let teacherPointerStartY = 0;
let teacherPointerActive = false;
let teacherSwipeMoved = false;
let spaceSliderTimer;
let activeSpaceSlide = 0;
let spacePointerStartX = 0;
let spacePointerStartY = 0;
let spacePointerActive = false;
let spaceSwipeMoved = false;
let reviewSliderTimer;
let activeReviewSlide = 0;
let reviewPointerStartX = 0;
let reviewPointerStartY = 0;
let reviewPointerActive = false;
let reviewSwipeMoved = false;
let teacherSliderEnabled = false;
let spaceSliderEnabled = false;
let reviewSliderEnabled = false;

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const renderTeacherCard = (teacher) => `
  <button class="teacher-card" type="button" data-teacher-id="${escapeHtml(teacher.id)}">
    <img src="${escapeHtml(teacher.image)}" alt="${escapeHtml(teacher.name)}" loading="lazy" />
    <div class="teacher-card__body">
      <h3>${escapeHtml(teacher.name)}</h3>
      <p class="teacher-card__language">${escapeHtml(teacher.cardLanguage)}</p>
      <span class="teacher-card__cta teacher-card__cta--button">Подробнее</span>
    </div>
  </button>
`;

const renderTeacherModal = (teacher) => {
  const details = teacher.details
    .filter(Boolean)
    .map((detail) => `<li>${escapeHtml(detail)}</li>`)
    .join("");
  const bio = teacher.bio
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  const quote = teacher.quote
    ? `<blockquote>${escapeHtml(teacher.quote)}</blockquote>`
    : "";

  return `
    <article class="teacher-dialog">
      <div class="teacher-dialog__media">
        <img src="${escapeHtml(teacher.image)}" alt="${escapeHtml(teacher.name)}" />
      </div>
      <div class="teacher-dialog__copy">
        <p class="teacher-dialog__meta">${escapeHtml(teacher.nativeLabel)}: ${escapeHtml(teacher.nativeLanguage)}</p>
        <h3 id="teacher-modal-title">${escapeHtml(teacher.name)}</h3>
        ${details ? `<ul class="teacher-dialog__list">${details}</ul>` : ""}
        ${bio}
        ${quote}
      </div>
    </article>
  `;
};

const renderSpaceLightbox = (image) => `
  <figure class="space-lightbox">
    <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || "Фотография Park Kultury Nursery")}" />
  </figure>
`;

if (teacherGrid) {
  teacherGrid.innerHTML = orderedTeacherData.map(renderTeacherCard).join("");
}

const getTeacherCards = () =>
  Array.from(teacherGrid?.querySelectorAll("[data-teacher-id]") || []);

const updateTeacherProgress = () => {
  if (!teacherProgressFill) {
    return;
  }

  const cards = getTeacherCards();

  if (!cards.length) {
    teacherProgressFill.style.width = "0%";
    return;
  }

  teacherProgressFill.style.width = `${((activeTeacherSlide + 1) / cards.length) * 100}%`;
};

const stopTeacherSlider = () => {
  if (!teacherSliderTimer) {
    return;
  }

  window.clearInterval(teacherSliderTimer);
  teacherSliderTimer = undefined;
};

const scrollTeacherSlide = (index, behavior = "smooth") => {
  if (!teacherGrid || window.innerWidth > 760) {
    return;
  }

  const cards = getTeacherCards();
  const targetCard = cards[index];

  if (!targetCard) {
    return;
  }

  teacherGrid.scrollTo({
    left: targetCard.offsetLeft,
    behavior,
  });
};

const goToTeacherSlide = (index, behavior = "smooth") => {
  const cards = getTeacherCards();

  if (!cards.length) {
    return;
  }

  const nextIndex = (index + cards.length) % cards.length;
  activeTeacherSlide = nextIndex;
  scrollTeacherSlide(activeTeacherSlide, behavior);
  updateTeacherProgress();
};

const startTeacherSlider = () => {
  if (!teacherSliderEnabled || !teacherGrid || window.innerWidth > 760 || teacherSliderTimer) {
    return;
  }

  const cards = getTeacherCards();

  if (cards.length < 2) {
    return;
  }

  teacherSliderTimer = window.setInterval(() => {
    if (modal?.classList.contains("is-open")) {
      return;
    }

    goToTeacherSlide(activeTeacherSlide + 1);
  }, 3000);
};

const getSpaceSlides = () =>
  Array.from(spaceSliderTrack?.querySelectorAll("[data-space-slide]") || []);

const updateSpaceProgress = () => {
  if (!spaceProgressFill) {
    return;
  }

  const slides = getSpaceSlides();

  if (!slides.length) {
    spaceProgressFill.style.width = "0%";
    return;
  }

  spaceProgressFill.style.width = `${((activeSpaceSlide + 1) / slides.length) * 100}%`;
};

const stopSpaceSlider = () => {
  if (!spaceSliderTimer) {
    return;
  }

  window.clearTimeout(spaceSliderTimer);
  spaceSliderTimer = undefined;
};

const scrollSpaceSlide = (index, behavior = "smooth") => {
  const slides = getSpaceSlides();
  const targetSlide = slides[index];

  if (!spaceSliderTrack || !targetSlide) {
    return;
  }

  spaceSliderTrack.scrollTo({
    left: targetSlide.offsetLeft,
    behavior,
  });
};

const goToSpaceSlide = (index, behavior = "smooth") => {
  const slides = getSpaceSlides();

  if (!slides.length) {
    return;
  }

  activeSpaceSlide = (index + slides.length) % slides.length;
  scrollSpaceSlide(activeSpaceSlide, behavior);
  updateSpaceProgress();
};

const startSpaceSlider = () => {
  if (!spaceSliderEnabled || !spaceSliderTrack || spaceSliderTimer) {
    return;
  }

  const slides = getSpaceSlides();

  if (slides.length < 2) {
    return;
  }

  const delay = activeSpaceSlide === 0 ? 4500 : 3000;

  spaceSliderTimer = window.setTimeout(() => {
    spaceSliderTimer = undefined;

    if (modal?.classList.contains("is-open")) {
      startSpaceSlider();
      return;
    }

    goToSpaceSlide(activeSpaceSlide + 1);
    startSpaceSlider();
  }, delay);
};

const pauseSpaceSlider = (delay = 5000) => {
  stopSpaceSlider();
  window.setTimeout(startSpaceSlider, delay);
};

const getReviewCards = () =>
  Array.from(reviewsSliderTrack?.querySelectorAll(".review-card") || []);

const getVisibleReviewCards = () => {
  if (window.innerWidth <= 760) {
    return 1;
  }

  if (window.innerWidth <= 1120) {
    return 2;
  }

  return 3;
};

const getMaxReviewSlide = () =>
  Math.max(getReviewCards().length - getVisibleReviewCards(), 0);

const updateReviewProgress = () => {
  if (!reviewsProgressFill) {
    return;
  }

  const cards = getReviewCards();

  if (!cards.length) {
    reviewsProgressFill.style.width = "0%";
    return;
  }

  const visibleCards = getVisibleReviewCards();
  reviewsProgressFill.style.width = `${(Math.min(activeReviewSlide + visibleCards, cards.length) / cards.length) * 100}%`;
};

const stopReviewSlider = () => {
  if (!reviewSliderTimer) {
    return;
  }

  window.clearTimeout(reviewSliderTimer);
  reviewSliderTimer = undefined;
};

const scrollReviewSlide = (index, behavior = "smooth") => {
  const cards = getReviewCards();
  const targetCard = cards[index];

  if (!reviewsSliderTrack || !targetCard) {
    return;
  }

  reviewsSliderTrack.scrollTo({
    left: targetCard.offsetLeft,
    behavior,
  });
};

const goToReviewSlide = (index, behavior = "smooth") => {
  const cards = getReviewCards();

  if (!cards.length) {
    return;
  }

  const maxSlide = getMaxReviewSlide();
  activeReviewSlide = index > maxSlide ? 0 : Math.max(index, 0);
  scrollReviewSlide(activeReviewSlide, behavior);
  updateReviewProgress();
};

const startReviewSlider = () => {
  if (!reviewSliderEnabled || !reviewsSliderTrack || reviewSliderTimer) {
    return;
  }

  const cards = getReviewCards();

  if (cards.length <= getVisibleReviewCards()) {
    return;
  }

  const delay = activeReviewSlide === 0 ? 5000 : 3000;

  reviewSliderTimer = window.setTimeout(() => {
    reviewSliderTimer = undefined;
    goToReviewSlide(activeReviewSlide + 1);
    startReviewSlider();
  }, delay);
};

const pauseReviewSlider = (delay = 5000) => {
  stopReviewSlider();
  window.setTimeout(startReviewSlider, delay);
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalWindow?.classList.remove("modal-window--gallery");
  modalWindow?.removeAttribute("aria-label");
  modalWindow?.setAttribute("aria-labelledby", "teacher-modal-title");
  document.body.classList.remove("is-locked");
  modalContent.innerHTML = "";
  startTeacherSlider();
  startSpaceSlider();
};

teacherGrid?.addEventListener("click", (event) => {
  if (teacherSwipeMoved) {
    teacherSwipeMoved = false;
    return;
  }

  if (!(event.target instanceof HTMLElement)) {
    return;
  }

  const trigger = event.target.closest("[data-teacher-id]");

  if (!(trigger instanceof HTMLElement)) {
    return;
  }

  const teacher = orderedTeacherData.find((item) => item.id === trigger.dataset.teacherId);

  if (!teacher) {
    return;
  }

  modalWindow?.removeAttribute("aria-label");
  modalWindow?.setAttribute("aria-labelledby", "teacher-modal-title");
  modalContent.innerHTML = renderTeacherModal(teacher);
  stopTeacherSlider();
  stopSpaceSlider();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
});

spaceSliderTrack?.addEventListener("click", (event) => {
  if (spaceSwipeMoved) {
    spaceSwipeMoved = false;
    return;
  }

  if (!(event.target instanceof HTMLElement)) {
    return;
  }

  const image = event.target.closest(".space-slide img");

  if (!(image instanceof HTMLImageElement)) {
    return;
  }

  stopSpaceSlider();
  modalWindow?.classList.add("modal-window--gallery");
  modalWindow?.setAttribute("aria-label", image.alt || "Фотография Park Kultury Nursery");
  modalWindow?.removeAttribute("aria-labelledby");
  modalContent.innerHTML = renderSpaceLightbox(image);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
});

modalCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeModal);
});

modal?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLElement && event.target.hasAttribute("data-modal-close")) {
    closeModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

teacherGrid?.addEventListener(
  "scroll",
  () => {
    if (window.innerWidth > 760) {
      return;
    }

    const cards = getTeacherCards();

    if (!cards.length) {
      return;
    }

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - teacherGrid.scrollLeft);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    activeTeacherSlide = nearestIndex;
    updateTeacherProgress();
  },
  { passive: true },
);

teacherGrid?.addEventListener("pointerdown", (event) => {
  if (window.innerWidth > 760) {
    return;
  }

  teacherPointerActive = true;
  teacherSwipeMoved = false;
  teacherPointerStartX = event.clientX;
  teacherPointerStartY = event.clientY;
  stopTeacherSlider();
});

teacherGrid?.addEventListener("pointermove", (event) => {
  if (!teacherPointerActive || window.innerWidth > 760) {
    return;
  }

  const deltaX = Math.abs(event.clientX - teacherPointerStartX);
  const deltaY = Math.abs(event.clientY - teacherPointerStartY);

  if (deltaX > 14 && deltaX > deltaY) {
    teacherSwipeMoved = true;
  }
});

teacherGrid?.addEventListener("pointerup", () => {
  teacherPointerActive = false;
  startTeacherSlider();
});

teacherGrid?.addEventListener("pointercancel", () => {
  teacherPointerActive = false;
  startTeacherSlider();
});

teacherPrevButton?.addEventListener("click", () => {
  stopTeacherSlider();
  goToTeacherSlide(activeTeacherSlide - 1);
  startTeacherSlider();
});

teacherNextButton?.addEventListener("click", () => {
  stopTeacherSlider();
  goToTeacherSlide(activeTeacherSlide + 1);
  startTeacherSlider();
});

spaceSliderTrack?.addEventListener(
  "scroll",
  () => {
    const slides = getSpaceSlides();

    if (!slides.length) {
      return;
    }

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - spaceSliderTrack.scrollLeft);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    activeSpaceSlide = nearestIndex;
    updateSpaceProgress();
  },
  { passive: true },
);

spaceSliderTrack?.addEventListener("pointerdown", (event) => {
  spacePointerActive = true;
  spaceSwipeMoved = false;
  spacePointerStartX = event.clientX;
  spacePointerStartY = event.clientY;
  stopSpaceSlider();
});

spaceSliderTrack?.addEventListener("pointermove", (event) => {
  if (!spacePointerActive) {
    return;
  }

  const deltaX = Math.abs(event.clientX - spacePointerStartX);
  const deltaY = Math.abs(event.clientY - spacePointerStartY);

  if (deltaX > 14 && deltaX > deltaY) {
    spaceSwipeMoved = true;
  }
});

spaceSliderTrack?.addEventListener("pointerup", () => {
  spacePointerActive = false;
  startSpaceSlider();
});

spaceSliderTrack?.addEventListener("pointercancel", () => {
  spacePointerActive = false;
  startSpaceSlider();
});

spacePrevButton?.addEventListener("click", () => {
  stopSpaceSlider();
  goToSpaceSlide(activeSpaceSlide - 1);
  startSpaceSlider();
});

spaceNextButton?.addEventListener("click", () => {
  stopSpaceSlider();
  goToSpaceSlide(activeSpaceSlide + 1);
  startSpaceSlider();
});

reviewsSliderTrack?.addEventListener(
  "scroll",
  () => {
    const cards = getReviewCards();

    if (!cards.length) {
      return;
    }

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - reviewsSliderTrack.scrollLeft);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    activeReviewSlide = Math.min(nearestIndex, getMaxReviewSlide());
    updateReviewProgress();
  },
  { passive: true },
);

reviewsSliderTrack?.addEventListener("pointerdown", (event) => {
  reviewPointerActive = true;
  reviewSwipeMoved = false;
  reviewPointerStartX = event.clientX;
  reviewPointerStartY = event.clientY;
  stopReviewSlider();
});

reviewsSliderTrack?.addEventListener("pointermove", (event) => {
  if (!reviewPointerActive) {
    return;
  }

  const deltaX = Math.abs(event.clientX - reviewPointerStartX);
  const deltaY = Math.abs(event.clientY - reviewPointerStartY);

  if (deltaX > 14 && deltaX > deltaY) {
    reviewSwipeMoved = true;
  }
});

reviewsSliderTrack?.addEventListener("pointerup", () => {
  reviewPointerActive = false;
  startReviewSlider();
});

reviewsSliderTrack?.addEventListener("pointercancel", () => {
  reviewPointerActive = false;
  startReviewSlider();
});

reviewsPrevButton?.addEventListener("click", () => {
  stopReviewSlider();
  goToReviewSlide(activeReviewSlide - 1);
  startReviewSlider();
});

reviewsNextButton?.addEventListener("click", () => {
  stopReviewSlider();
  goToReviewSlide(activeReviewSlide + 1);
  startReviewSlider();
});

const syncTeacherSlider = () => {
  if (!teacherGrid) {
    return;
  }

  if (window.innerWidth > 760) {
    stopTeacherSlider();
    activeTeacherSlide = 0;
    teacherGrid.scrollTo({ left: 0, behavior: "auto" });
    updateTeacherProgress();
    return;
  }

  goToTeacherSlide(activeTeacherSlide, "auto");
  startTeacherSlider();
};

const syncSpaceSlider = () => {
  if (!spaceSliderTrack) {
    return;
  }

  goToSpaceSlide(activeSpaceSlide, "auto");
  startSpaceSlider();
};

const syncReviewSlider = () => {
  if (!reviewsSliderTrack) {
    return;
  }

  activeReviewSlide = Math.min(activeReviewSlide, getMaxReviewSlide());
  goToReviewSlide(activeReviewSlide, "auto");
  startReviewSlider();
};

const enableObservedSlider = (target, onEnable) => {
  if (!target) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        onEnable();
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.26,
      rootMargin: "0px 0px -18% 0px",
    },
  );

  observer.observe(target);
};

enableObservedSlider(document.querySelector("#space .section-heading"), () => {
  spaceSliderEnabled = true;
  startSpaceSlider();
});

enableObservedSlider(document.getElementById("teachers"), () => {
  teacherSliderEnabled = true;
  startTeacherSlider();
});

enableObservedSlider(document.querySelector(".section-heading-reviews"), () => {
  reviewSliderEnabled = true;
  startReviewSlider();
});

syncTeacherSlider();
syncSpaceSlider();
syncReviewSlider();

window.addEventListener("resize", syncTeacherSlider);
window.addEventListener("resize", syncSpaceSlider);
window.addEventListener("resize", syncReviewSlider);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopTeacherSlider();
    stopSpaceSlider();
    stopReviewSlider();
    return;
  }

  startTeacherSlider();
  startSpaceSlider();
  startReviewSlider();
});

const visitForm = document.getElementById("visit-form");
const toast = document.getElementById("form-toast");
const phoneInputs = document.querySelectorAll("[data-phone-mask]");
let toastTimer;

const formatRussianPhone = (value) => {
  const digits = value.replace(/\D/g, "");
  const normalizedDigits = digits.startsWith("8")
    ? `7${digits.slice(1)}`
    : digits.startsWith("7")
      ? digits
      : `7${digits}`;
  const phoneDigits = normalizedDigits.slice(1, 11);
  const parts = [
    phoneDigits.slice(0, 3),
    phoneDigits.slice(3, 6),
    phoneDigits.slice(6, 8),
    phoneDigits.slice(8, 10),
  ];

  let formatted = "+7";

  if (parts[0]) {
    formatted += ` (${parts[0]}`;
  }

  if (parts[0]?.length === 3) {
    formatted += ")";
  }

  if (parts[1]) {
    formatted += ` ${parts[1]}`;
  }

  if (parts[2]) {
    formatted += `-${parts[2]}`;
  }

  if (parts[3]) {
    formatted += `-${parts[3]}`;
  }

  return formatted;
};

phoneInputs.forEach((input) => {
  input.addEventListener("focus", () => {
    if (!input.value.trim()) {
      input.value = "+7";
    }
  });

  input.addEventListener("input", () => {
    input.value = formatRussianPhone(input.value);
  });
});

visitForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(visitForm);
  const name = String(formData.get("name") || "").trim();

  toast.textContent = name
    ? `${name}, спасибо. Заявка принята, администратор свяжется с вами для согласования экскурсии.`
    : "Спасибо. Заявка принята, администратор свяжется с вами для согласования экскурсии.";

  toast.classList.add("is-visible");
  visitForm.reset();

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3400);
});
